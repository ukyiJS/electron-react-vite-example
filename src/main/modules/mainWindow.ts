import { BrowserWindow, BrowserWindowConstructorOptions, app } from 'electron';
import path from 'path';
import { container } from 'tsyringe';

export class MainWindow {
  private static mainWindow: MainWindow;

  init = async () => {
    const config: BrowserWindowConstructorOptions = {
      show: false,
      vibrancy: 'under-window',
      visualEffectState: 'active',
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.join(app.getAppPath(), 'dist', 'preload.js'),
      },
    };
    container.register(BrowserWindow, { useValue: new BrowserWindow(config) });
    const mainWindow = container.resolve(BrowserWindow);

    const pageUrl = import.meta.env.DEV ? import.meta.env.VITE_DEV_SERVER_URL : new URL('dist/index.html', `file://${__dirname}`).toString();
    await mainWindow.loadURL(pageUrl);
    mainWindow.once('ready-to-show', () => mainWindow.show());

    return mainWindow;
  };

  static create = async () => {
    if (!this.mainWindow) this.mainWindow = new MainWindow();

    let window = BrowserWindow.getAllWindows().find(w => !w.isDestroyed());

    if (!window) window = await this.mainWindow.init();
    if (window.isMinimized()) window.restore();
    if (!window.isVisible()) window.show();
    window.focus();
  };
}
