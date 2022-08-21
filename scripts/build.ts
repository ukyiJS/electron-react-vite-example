/* eslint-disable no-console */
import { CliOptions } from 'electron-builder/out/builder';
import path from 'path';
import { build as viteBuild, InlineConfig } from 'vite';
import { build as electronBuild, createTargets, Platform } from 'electron-builder';

process.env.MODE = process.env.MODE || 'production';
const join = (...paths: string[]) => path.join(process.cwd(), ...paths);

type ConfigOption = {
  name: 'main' | 'preload';
  configFile: string;
};

const config = ({ name, configFile }: ConfigOption) => ({
  configFile,
  root: join('src', name),
  mode: process.env.MODE,
  logLevel: 'info',
  build: {
    rollupOptions: {
      rollupOptions: {
        output: {
          entryFileNames: `${name}.js`,
        },
      },
    },
  },
} as InlineConfig);

const buildConfig = {
  main: config({ name: 'main', configFile: 'config/vite.config.main.ts' }),
  preload: config({ name: 'preload', configFile: 'config/vite.config.main.ts' }),
  renderer: { configFile: 'config/vite.config.renderer.ts' } as InlineConfig,
  mac: { targets: createTargets([Platform.MAC], 'default', 'universal') } as CliOptions,
  window: { targets: createTargets([Platform.WINDOWS], 'nsis', 'x64') } as CliOptions,
};

const build = async () => {
  for (const config of [buildConfig.main, buildConfig.preload, buildConfig.renderer]) {
    await viteBuild(config);
  }
  await Promise.all([buildConfig.mac, buildConfig.window].map(config => electronBuild(config)));
};

build().catch(error => {
  console.error(error);
  process.exit(1);
});
