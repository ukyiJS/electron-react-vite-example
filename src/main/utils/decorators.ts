import { singleton, injectable, inject } from 'tsyringe';

export const IPC_INVOKE = 'ipc:invoke';
export const IPC_ON = 'ipc:on';

export const IpcInvoke = (event: string): MethodDecorator => {
  if (!event) throw new Error('ipc invoke event is required');
  return (target, propertyName) => Reflect.defineMetadata(IPC_INVOKE, event, target, propertyName);
};

export const IpcSend = (event: string): MethodDecorator => {
  if (!event) throw new Error('ipc on event is required');
  return (target, propertyName) => Reflect.defineMetadata(IPC_ON, event, target, propertyName);
};

export const Controller = singleton;
export const Injectable = injectable;
export const Inject = inject;
