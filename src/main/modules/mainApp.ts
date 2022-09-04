import { MainWindow } from '@main/modules/mainWindow';
import { Inject, Injectable } from '@main/utils/decorators';
import { app } from 'electron';

@Injectable()
export class MainApp {
  constructor(@Inject(MainWindow) private mainWindow: MainWindow) {
    this.init().catch(e => {
      console.error('Failed create window:', e);
      app.quit();
    });
  }

  init = async () => {
    if (!app.requestSingleInstanceLock()) app.quit();

    const window = await app.whenReady().then(this.mainWindow.create);
    app.on('activate', () => window?.show());
    app.on('window-all-closed', () => process.platform !== 'darwin' && app.quit());
    app.on('second-instance', () => {
      if (!window) return;
      if (window.isMinimized()) window.restore();
      window.focus();
    });

    if (import.meta.env.DEV) {
      app.whenReady()
        .then(() => import('electron-debug').then(({ default: debug }) => debug({ showDevTools: false })))
        .then(() => import('../modules/devTools').then(({ DevTools }) => DevTools.install(DevTools.REACT)));
    }
  };
}
