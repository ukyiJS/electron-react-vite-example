/* eslint-disable no-console */
import chalk from 'chalk';
import { ChildProcess, spawn } from 'child_process';
import electron from 'electron';
import path from 'path';
import { build, createServer, ResolvedServerUrls, ViteDevServer } from 'vite';

process.env.MODE = process.env.MODE ?? 'development';
const join = (...paths: string[]) => path.join(process.cwd(), ...paths);

type WatcherOption = {
  name: 'preload' | 'main';
  configFile: string;
  writeBundle(): void | Promise<void>
};

const watcher = ({ name, configFile, writeBundle }: WatcherOption) => build({
  configFile,
  mode: process.env.MODE,
  root: join('src', name),
  build: {
    watch: {},
    rollupOptions: {
      output: {
        entryFileNames: `${name}.js`,
      },
    },
  },
  plugins: [{
    name: `reload-page-on-${name}-change`,
    writeBundle,
  }],
});

const createDevServer = async () => {
  const server = await createServer({
    configFile: 'config/vite.config.renderer.ts',
  }).then(({ listen }) => listen());

  [process.env.VITE_DEV_SERVER_URL] = (server.resolvedUrls as ResolvedServerUrls).local;
  console.log(chalk.green(`🚀 dev-server running at: ${chalk.underline(process.env.VITE_DEV_SERVER_URL)}`));

  return server;
};

const setupPreloadWatcher = async (server: ViteDevServer) => {
  await watcher({
    name: 'preload',
    configFile: 'config/vite.config.main.ts',
    writeBundle() {
      server.ws.send({ type: 'full-reload' });
    },
  });

  return server;
};

const setupMainWatcher = async (server: ViteDevServer) => {
  let electronApp: ChildProcess | null = null;
  await watcher({
    name: 'main',
    configFile: 'config/vite.config.main.ts',
    writeBundle() {
      if (electronApp) {
        electronApp.removeListener('exit', process.exit);
        electronApp.kill('SIGINT');
        electronApp = null;
      }

      electronApp = spawn(String(electron), ['.'], { stdio: 'inherit' });
      electronApp.addListener('exit', process.exit);
    },
  });

  return server;
};

createDevServer()
  .then(setupPreloadWatcher)
  .then(setupMainWatcher)
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
