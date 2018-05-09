import isElectron from 'is-electron';

export default class Utils {
  static openExternalLink = (url) => {
    if (isElectron()) {
      window.shell.openExternal(url);
    } else {
      window.open(url);
    }
  }
}
