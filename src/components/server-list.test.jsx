import React from 'react';
import ServerList from './server-list';
import utils from '../utils';
import { shallow } from 'enzyme';
import hotelApi, { STOPPED, RUNNING } from '../api';

describe('ServerList', () => {
  const servers = [
    { id: 'test-server-1', status: 'running', env: {} },
    { id: 'test-server-2', status: 'stopped', env: {} },
    { id: 'test-server-3', status: 'running', env: { PORT: 3000 } },
  ];
  let updateServerStatusFn;
  let loadServersFn;

  beforeEach(() => {
    updateServerStatusFn = jest.fn();
    loadServersFn = jest.fn();
  });

  function create() {
    return shallow(<ServerList updateServerStatus={updateServerStatusFn} loadServers={loadServersFn} servers={servers} />);
  }

  it('matches the snapshot', () => {
    const rendered = create();
    expect(rendered).toMatchSnapshot();
  });

  describe('#startServer', () => {
    let instance;

    beforeEach(() => {
      instance = create().instance();
      hotelApi.startServer = jest.fn().mockReturnValue(Promise.resolve());
      instance.startServer(servers[0].id);
    });

    it('calls the api', () => {
      expect(hotelApi.startServer).toHaveBeenCalledWith('test-server-1');
    });

    it('updates the state', () => {
      expect(updateServerStatusFn).toHaveBeenCalledWith('test-server-1', RUNNING);
    });
  });

  describe('#stopServer', () => {
    let instance;

    beforeEach(() => {
      instance = create().instance();
      hotelApi.stopServer = jest.fn().mockReturnValue(Promise.resolve());
      instance.stopServer(servers[0].id);
    });

    it('calls the api', () => {
      expect(hotelApi.stopServer).toHaveBeenCalledWith('test-server-1');
    });

    it('updates the state', () => {
      expect(updateServerStatusFn).toHaveBeenCalledWith('test-server-1', STOPPED);
    });
  });

  describe('#restartServer', () => {
    let instance;

    beforeEach(() => {
      instance = create().instance();
      hotelApi.startServer = jest.fn().mockReturnValue(Promise.resolve());
      hotelApi.stopServer = jest.fn().mockReturnValue(Promise.resolve());
      instance.restartServer(servers[0]);
    });

    it('calls the api', () => {
      expect(hotelApi.startServer).toHaveBeenCalledWith('test-server-1');
      expect(hotelApi.stopServer).toHaveBeenCalledWith('test-server-1');
    });
  });

  describe('#toggleServer', () => {
    let instance;

    beforeEach(() => {
      instance = create().instance();
      hotelApi.startServer = jest.fn().mockReturnValue(Promise.resolve());
      hotelApi.stopServer = jest.fn().mockReturnValue(Promise.resolve());
    });

    it('starts when it is stopped', () => {
      instance.toggleServer(servers[1]);
      expect(hotelApi.startServer).toHaveBeenCalledWith('test-server-2');
    });

    it('stops when it is started', () => {
      instance.toggleServer(servers[0]);
      expect(hotelApi.stopServer).toHaveBeenCalledWith('test-server-1');
    });
  });

  describe('#openLogs', () => {
    let instance;

    beforeEach(() => {
      instance = create().instance();
    });

    it('send an event via ipcRenderer', () => {
      global.ipcRenderer = { send: jest.fn() };
      instance.openLogs(servers[1]);
      expect(global.ipcRenderer.send).toHaveBeenCalledWith('showDock', servers[1].id);
    });
  });

  describe('#openServer', () => {
    let instance, openLinkSpy;

    beforeEach(() => {
      instance = create().instance();
      openLinkSpy = jest.spyOn(utils, 'openExternalLink');
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
      openLinkSpy.mockClear();
    });

    it('can open server and reload servers afterwards', () => {
      instance.openServer(servers[0]);
      expect(utils.openExternalLink).toHaveBeenCalledWith('http://test-server-1.localhost');
      expect(loadServersFn).toHaveBeenCalled();
      loadServersFn.mockClear();
    });

    it('can open server with port in URL if defined', () => {
      instance.openServer(servers[2]);
      expect(utils.openExternalLink).toHaveBeenCalledWith('http://test-server-3.localhost:3000');
    });
  });
});
