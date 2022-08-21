import path from 'path';
import { defineConfig } from 'vite';

const join = (...paths: string[]) => path.join(process.cwd(), ...paths);

export default defineConfig({
  logLevel: 'warn',
  envDir: process.cwd(),
  resolve: {
    alias: {
      '@main': join('src', 'main'),
      '@preload': join('src', 'preload'),
      '@renderer': join('src', 'renderer'),
    },
  },
  build: {
    ssr: true,
    outDir: join('dist'),
    minify: process.env.MODE === 'production',
    lib: {
      entry: 'index.ts',
      formats: ['cjs'],
    },
    emptyOutDir: false,
  },
});
