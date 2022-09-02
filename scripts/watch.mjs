import chalk from 'chalk';
import { ChildProcess, spawn } from 'child_process';
import electron from 'electron';
import path from 'path';
import { build, createServer } from 'vite';

/** @typedef WatcherOption {{ name: 'preload' | 'main'; configFile: string; writeBundle(): void | Promise<void> }} */
/** @typedef import('vite').ViteDevServer */

process.env.MODE = process.env.MODE ?? 'development';
/** @type {(...paths: string[]) => string} */
const join = (...paths) => path.join(process.cwd(), ...paths);

/** @param {WatcherOption} option */
const watcher = ({ name, configFile, writeBundle }) => build({
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

  [process.env.VITE_DEV_SERVER_URL] = server.resolvedUrls.local;
  console.log(chalk.green(`🚀 dev-server running at: ${chalk.underline(process.env.VITE_DEV_SERVER_URL)}`));

  return server;
};

/** @param {ViteDevServer} server  */
const setupPreloadWatcher = async (server) => {
  await watcher({
    name: 'preload',
    configFile: 'config/vite.config.main.ts',
    writeBundle() {
      server.ws.send({ type: 'full-reload' });
    },
  });

  return server;
};

/** @param {ViteDevServer} server  */
const setupMainWatcher = async (server) => {
  /** @type {ChildProcess} */
  let electronApp = null;
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
