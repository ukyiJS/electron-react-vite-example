/* eslint-disable no-template-curly-in-string */
require('dotenv/config');

/** @type {import('electron-builder').Configuration} */
const config = {
  productName: 'ukyi-app',
  appId: 'ukyi.app',
  files: ['dist/**/*'],
  publish: [
    {
      provider: 'github',
      owner: 'ukyiJS',
      repo: 'electron-react-vite-template',
      token: process.env.GH_TOKEN,
    },
  ],
  directories: {
    output: 'release/${version}',
  },
  mac: {
    category: 'public.app-category.utilities',
    artifactName: '${productName}-${version}-${os}.${ext}',
  },
  win: {
    artifactName: '${productName}-${version}-${os}.${ext}',
  },
  dmg: {
    artifactName: '${productName}-${version}.${ext}',
  },
  nsis: {
    artifactName: '${productName}-${version}.${ext}',
  },
};

module.exports = config;
