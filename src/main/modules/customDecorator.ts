import { BrowserWindow, ipcMain } from 'electron';
import { container } from 'tsyringe';
import { CONTROLLERS, Injectable, InjectAll, IPC_INVOKE, IPC_SEND } from '../utils/decorators';

@Injectable()
export class CustomDecorator {
  constructor(@InjectAll(CONTROLLERS) private controllers: Constructor[]) {
    this.controllers.forEach(ControllerClass => {
      const controller = container.resolve(ControllerClass);
      const controllerMethods = Object.getOwnPropertyNames(ControllerClass.prototype).filter(name => name !== 'constructor');
      controllerMethods.forEach(methodName => {
        this.addIpcInvokeMethodDecorator(controller, methodName);
        this.addIpcSendMethodDecorator(controller, methodName);
      });
    });
  }

  addIpcInvokeMethodDecorator(controller: any, methodName: string) {
    const ipcInvokeEvent = Reflect.getMetadata(IPC_INVOKE, controller, methodName);
    if (!ipcInvokeEvent) return;

    ipcMain.handle(ipcInvokeEvent, async (event, ...args) => Reflect.apply(controller[methodName], controller, args));
  }

  addIpcSendMethodDecorator(controller: any, methodName: string) {
    const method = controller[methodName];
    const ipcSendEvent = Reflect.getMetadata(IPC_SEND, controller, methodName);
    if (!ipcSendEvent) return;

    controller[methodName] = async (...args: any[]) => {
      const result = Reflect.apply(method, controller, args);
      const mainWindow = container.resolve(BrowserWindow);
      mainWindow.webContents?.send(ipcSendEvent, result);
      return result;
    };
  }
}
