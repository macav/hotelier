import isElectron from 'is-electron';
import { Server, Status } from './interfaces';

export default class Utils {
  static isElectron = (): boolean => {
    return isElectron();
  };

  static openExternalLink = (url: string): void => {
    if (Utils.isElectron()) {
      window.shell.openExternal(url);
    } else {
      window.open(url);
    }
  };

  static sortServers = (servers: Server[]): Server[] => {
    return servers.sort((a, b) => {
      if (a.status === Status.RUNNING && b.status !== Status.RUNNING) {
        return -1;
      } else if (b.status === Status.RUNNING && a.status !== Status.RUNNING) {
        return 1;
      }
      if (a.id < b.id) {
        return -1;
      } else if (a.id > b.id) {
        return 1;
      }
      return 0;
    });
  };
}
