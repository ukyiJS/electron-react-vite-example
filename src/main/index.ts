import { app } from 'electron';
import 'reflect-metadata';
import { AppController } from './app.controller';
import { MainWindow } from './modules/MainWindow';
import { appModule } from './utils/appModule';

const initElectronApp = () => {
  app.disableHardwareAcceleration();
  app.on('window-all-closed', () => process.platform !== 'darwin' && app.quit());
  app.on('activate', MainWindow.create);
};

(async () => {
  try {
    initElectronApp();
    await appModule({
      window: MainWindow.create,
      controllers: [AppController],
    });
  } catch (e) {
    console.error('Failed create window:', e);
    app.quit();
  }
})();
