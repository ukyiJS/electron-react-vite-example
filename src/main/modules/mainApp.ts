import { MainWindow } from '@main/modules/mainWindow';
import { app, BrowserWindow } from 'electron';
import { container } from 'tsyringe';

export class MainApp {
  constructor() {
    this.init();
  }

  init = () => {
    app.on('window-all-closed', () => {
      container.resolve(BrowserWindow).destroy();
      if (process.platform !== 'darwin') app.quit();
    });

    app.on('second-instance', () => {
      const window = container.resolve(BrowserWindow);
      if (!window) return;

      if (window.isMinimized()) window.restore();
      window.focus();
    });

    app.on('activate', () => {
      container.resolve(BrowserWindow)?.show();
    });

    const isSingleInstance = app.requestSingleInstanceLock();
    if (!isSingleInstance) {
      app.quit();
      process.exit(0);
    }

    if (import.meta.env.DEV) {
      app.whenReady()
        .then(() => import('electron-debug').then(({ default: debug }) => debug({ showDevTools: false })))
        .then(() => import('../modules/devTools').then(({ DevTools }) => DevTools.install(DevTools.REACT)));
    }

    app.whenReady().then(container.resolve(MainWindow).create);
  };
}
