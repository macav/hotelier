import isElectron from 'is-electron';
import fs from 'fs';
import { ipcRenderer } from 'electron';

console.log(fs);

ipcRenderer.once('hotelPort', (msg) => {
  // window.hotelPort =
  console.log(msg);
});

export default class Utils {
  static isElectron = () => {
    return isElectron();
  }

  static openExternalLink = (url) => {
    if (Utils.isElectron()) {
      window.shell.openExternal(url);
    } else {
      window.open(url);
    }
  }
}
