import { app, BrowserWindow } from 'electron';
import debounce from 'lodash/debounce';
import { join } from 'path';
import { container } from 'tsyringe';
import { Inject, Injectable } from '../utils/decorators';
import { Setting } from './setting';

@Injectable()
export class MainWindow {
  private pageUrl = import.meta.env.DEV ? import.meta.env.VITE_DEV_SERVER_URL : new URL('dist/index.html', `file://${__dirname}`).toString();

  constructor(@Inject(Setting) private setting: Setting) {
  }

  private init = async () => {
    await app.whenReady();

    const bounds = this.setting.get('bounds') ?? {};
    const window = new BrowserWindow({
      ...bounds,
      show: false,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: true,
        preload: join(app.getAppPath(), 'dist', 'preload.js'),
      },
    });
    container.register(BrowserWindow, { useValue: window });
    await window.loadURL(this.pageUrl);
    window.once('ready-to-show', window.show);

    this.addWindowHideEvent(window);
    this.addWindowMoveEvent(window);
    this.addWindowResizeEvent(window);

    return window;
  };

  create = async () => {
    const window = BrowserWindow.getAllWindows().find(w => !w.isDestroyed()) ?? await this.init();
    if (window.isMinimized()) window.restore();
    window.focus();

    return window;
  };

  private addWindowHideEvent = (window: BrowserWindow) => {
    let isAppQuitting = false;
    app.on('before-quit', () => (isAppQuitting = true));

    window.on('close', e => {
      if (!isAppQuitting) e.preventDefault();
      window.hide();
    });
  };

  private addWindowMoveEvent = (window: BrowserWindow) => {
    window.addListener('move', debounce(() => this.setting.set('bounds', window.getBounds()), 300));
  };

  private addWindowResizeEvent = (window: BrowserWindow) => {
    window.addListener('resize', debounce(() => this.setting.set('bounds', window.getBounds()), 300));
  };
}
