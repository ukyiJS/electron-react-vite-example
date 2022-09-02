import 'reflect-metadata';
import { MainWindow } from '@main/modules/mainWindow';
import { app, BrowserWindow } from 'electron';
import { container } from 'tsyringe';
import { AppController } from './app.controller';
import { appModule } from './utils/appModule';

const initApp = async () => {
  app.on('window-all-closed', () => {
    container.resolve(BrowserWindow).destroy();
    if (process.platform !== 'darwin') app.quit();
  });

  app.on('second-instance', () => {
    const mainWindow = container.resolve(BrowserWindow);
    if (!mainWindow) return;

    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  });

  app.on('activate', () => {
    const mainWindow = BrowserWindow.getAllWindows().find(w => !w.isDestroyed());
    if (mainWindow) return mainWindow.focus();
    return MainWindow.create();
  });

  const isSingleInstance = app.requestSingleInstanceLock();
  if (!isSingleInstance) {
    app.quit();
    process.exit(0);
  }

  if (import.meta.env.DEV) {
    app.whenReady()
      .then(() => import('electron-debug').then(({ default: debug }) => debug({ showDevTools: false })))
      .then(() => import('./modules/devTools').then(({ DevTools }) => DevTools.install(DevTools.REACT)));
  }
  await app.whenReady().then(MainWindow.create);
};

(async () => {
  try {
    await initApp();
    await appModule({
      controllers: [AppController],
    });
  } catch (e) {
    console.error('Failed create window:', e);
    app.quit();
  }
})();
