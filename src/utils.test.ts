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
});
