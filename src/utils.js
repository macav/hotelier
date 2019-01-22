import isElectron from 'is-electron';

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
