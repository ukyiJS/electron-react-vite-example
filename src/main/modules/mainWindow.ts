import { BrowserWindow } from 'electron';
import path from 'path';
import { container } from 'tsyringe';

export class MainWindow extends BrowserWindow {
  constructor() {
    super({
      show: false,
      vibrancy: 'under-window',
      visualEffectState: 'active',
      webPreferences: {
        preload: path.join(process.cwd(), 'dist', 'preload.js'),
      },
    });
  }

  static create = async () => {
    const window = new MainWindow();

    const pageUrl = import.meta.env.DEV ? import.meta.env.VITE_DEV_SERVER_URL : new URL('dist/index.html', `file://${__dirname}`).toString();
    window.loadURL(pageUrl).finally();

    window.on('closed', window.destroy);
    window.once('ready-to-show', () => {
      if (!window.isVisible()) window.show();
      if (process.env.MODE === 'development') window.webContents.openDevTools();
    });

    container.register(MainWindow, { useValue: window });
    return container.resolve(MainWindow);
  };
}
