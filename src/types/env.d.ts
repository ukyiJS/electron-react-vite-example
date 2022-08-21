import { AppInterface } from '@preload/index';

interface ImportMetaEnv {
  readonly VITE_DEV_SERVER_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace NodeJS {
  interface Process {
  }

  interface ProcessEnv {
    NODE_ENV: 'development' | 'production';
    MODE: 'development' | 'production';
    VITE_DEV_SERVER_URL: string;
  }
}

declare global {
  interface Window {
    app: AppInterface;
  }
}
