import { Server, Status } from './interfaces';
import utils from './utils';
jest.mock('is-electron', () => () => false);

describe('utils', () => {
  describe('#isElectron', () => {
    it('returns mocked value', () => {
      expect(utils.isElectron()).toEqual(false);
    });
  });

  describe('#openExternalLink', () => {
    it('opens using window when not running from electron', () => {
      utils.isElectron = jest.fn().mockImplementation(() => false);
      window.open = jest.fn();
      utils.openExternalLink('link');
      expect(window.open).toHaveBeenCalledWith('link');
    });

    it('opens using shell when running from electron', () => {
      utils.isElectron = jest.fn().mockImplementation(() => true);
      window.shell = {
        openExternal: jest.fn(),
      };
      utils.openExternalLink('link');
      expect(window.shell.openExternal).toHaveBeenCalledWith('link');
    });
  });

  describe('#sortServers', () => {
    it('puts running servers on top, the rest is sorted by the id', () => {
      const servers: Server[] = [
        { id: 'c', status: Status.CRASHED, env: {} },
        { id: 'b', status: Status.RUNNING, env: {} },
        { id: 'a', status: Status.STOPPED, env: {} },
        { id: 'a', status: Status.STOPPED, env: {} },
      ];
      utils.sortServers(servers);
      expect(servers[0].id).toEqual('b');
      expect(servers[1].id).toEqual('a');
      expect(servers[2].id).toEqual('a');
      expect(servers[3].id).toEqual('c');
    });
  });
});
