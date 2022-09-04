import { app, type Rectangle } from 'electron';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

type SettingData = {
  bounds: Rectangle
};

const parseDataFile = (filePath: string, defaultSetting = {} as SettingData) => {
  try {
    return JSON.parse(readFileSync(filePath).toString());
  } catch (error) {
    return defaultSetting;
  }
};

export class Setting {
  private dataPath = join(app.getPath('userData'), 'string.json');
  private data = parseDataFile(this.dataPath) as SettingData;

  get<K extends keyof SettingData>(key: K): SettingData[K] {
    return this.data[key];
  }

  set<K extends keyof SettingData>(key: K, data: SettingData[K]) {
    this.data[key] = data;
    writeFileSync(this.dataPath, JSON.stringify(this.data));
  }
}
