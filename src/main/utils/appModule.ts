import { IPC_INVOKE, IPC_ON } from '@main/utils/decorators';
import { BrowserWindow, ipcMain } from 'electron';
import { container } from 'tsyringe';
import InjectionToken from 'tsyringe/dist/typings/providers/injection-token';

type Class<T = any> = new (...args: Array<any>) => T;
type Inject = {
  token: InjectionToken;
  inject: any;
};
type Option = {
  controllers: Class[];
  injects?: Inject[]
};

export const appModule = async ({ controllers, injects }: Option) => {
  if (injects) injects.forEach(({ token, inject }) => container.register(token, { useValue: inject }));

  controllers.forEach(ControllerClass => {
    const controller = container.resolve(ControllerClass);

    const controllerMethods = Object.getOwnPropertyNames(ControllerClass.prototype).filter(name => name !== 'constructor');
    controllerMethods.forEach(methodName => {
      const method = controller[methodName];
      const [invokeEvent, onEvent] = [IPC_INVOKE, IPC_ON].map(metadataKey => Reflect.getMetadata(metadataKey, controller, methodName));
      if (invokeEvent) {
        ipcMain.handle(invokeEvent, async (event, ...args) => Reflect.apply(method, controller, args));
      }
      if (onEvent) {
        controller[methodName] = async (...args: any[]) => {
          const result = Reflect.apply(method, controller, args);
          container.resolve(BrowserWindow).webContents?.send(onEvent, result);

          return result;
        };
      }
    });
  });
};
