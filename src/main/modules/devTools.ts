import installExtension, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from 'electron-devtools-installer';

interface ExtensionReference {
  id: string;
  electron: string;
}

export class DevTools {
  static REACT = REACT_DEVELOPER_TOOLS;
  static REDUX = REDUX_DEVTOOLS;

  static install(...extensions: ExtensionReference[]) {
    return installExtension(extensions, { loadExtensionOptions: { allowFileAccess: true } });
  }
}
