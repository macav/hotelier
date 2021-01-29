import isElectron from 'is-electron';

export default class Utils {
  static isElectron = (): boolean => {
    return isElectron();
  }

  static openExternalLink = (url: string): void => {
    if (Utils.isElectron()) {
      window.shell.openExternal(url);
    } else {
      window.open(url);
    }
  }
}
