/* eslint-disable no-console */
import path from 'path';
import { build as viteBuild } from 'vite';
import { build as electronBuild, createTargets, Platform } from 'electron-builder';

process.env.MODE = process.env.MODE || 'production';
/** @type {(...paths: string[]) => string} */
const join = (...paths) => path.join(process.cwd(), ...paths);

/** @typedef PackageName 'main' | 'preload' */
/** @typedef ConfigOption {{ name: PackageName; configFile: string; }} */
/** @typedef import('vite').InlineConfig */

/**
 * @param {ConfigOption} option
 * @return {InlineConfig}
 */
const config = ({ name, configFile }) => /** @type {InlineConfig} */({
  configFile,
  root: join('src', name),
  mode: process.env.MODE,
  logLevel: 'info',
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `${name}.js`,
      },
    },
  },
});

const buildConfig = {
  main: config({ name: 'main', configFile: 'config/vite.config.main.ts' }),
  preload: config({ name: 'preload', configFile: 'config/vite.config.main.ts' }),
  renderer: { configFile: 'config/vite.config.renderer.ts' },
  mac: { targets: createTargets([Platform.MAC], 'default', 'universal') },
  window: { targets: createTargets([Platform.WINDOWS], 'nsis', 'x64') },
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
