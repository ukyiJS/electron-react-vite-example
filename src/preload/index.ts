import { contextBridge, IpcRenderer, ipcRenderer } from 'electron';

export type AppInterface = {
  on(...params: Parameters<IpcRenderer['on']>): number;
  off(id: number): void;
  invoke: IpcRenderer['invoke'];
};

type PairMap = {
  [key: number]: {
    channel: string;
    listener: Parameters<IpcRenderer['on']>[1];
  }
};

const pairMap = {} as PairMap;
let seq = 0;
contextBridge.exposeInMainWorld('app', {
  invoke: ipcRenderer.invoke.bind(ipcRenderer),
  on: (channel, listener) => {
    seq += 1;
    pairMap[seq] = { channel, listener };
    ipcRenderer.on(channel, listener);
    return seq;
  },
  off: id => {
    const { channel, listener } = pairMap[id];
    ipcRenderer.removeListener(channel, listener);
    delete pairMap[id];
  },
} as AppInterface);
