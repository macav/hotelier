import { shallow } from 'enzyme';
import React from 'react';
import hotelApi from '../api';
import { Server, Status } from '../interfaces';
import utils from '../utils';
import ServerList from './server-list';

describe('ServerList', () => {
  const servers: Server[] = [
    { id: 'test-server-1', status: Status.RUNNING, env: {} },
    { id: 'test-server-2', status: Status.STOPPED, env: {} },
    { id: 'test-server-3', status: Status.RUNNING, env: { PORT: 3000 } },
  ];
  let updateServerStatusFn: any;
  let loadServersFn: any;

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
      instance = create().instance() as ServerList;
      hotelApi.startServer = jest.fn().mockReturnValue(Promise.resolve());
      instance.startServer(servers[0].id);
    });

    it('calls the api', () => {
      expect(hotelApi.startServer).toHaveBeenCalledWith('test-server-1');
    });

    it('updates the state', () => {
      expect(updateServerStatusFn).toHaveBeenCalledWith('test-server-1', Status.RUNNING);
    });
  });

  describe('#stopServer', () => {
    let instance;

    beforeEach(() => {
      instance = create().instance() as ServerList;
      hotelApi.stopServer = jest.fn().mockReturnValue(Promise.resolve());
      instance.stopServer(servers[0].id);
    });

    it('calls the api', () => {
      expect(hotelApi.stopServer).toHaveBeenCalledWith('test-server-1');
    });

    it('updates the state', () => {
      expect(updateServerStatusFn).toHaveBeenCalledWith('test-server-1', Status.STOPPED);
    });
  });

  describe('#restartServer', () => {
    let instance;

    beforeEach(() => {
      instance = create().instance() as ServerList;
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
    let instance: ServerList;

    beforeEach(() => {
      instance = create().instance() as ServerList;
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
    let instance: ServerList;

    beforeEach(() => {
      instance = create().instance() as ServerList;
    });

    it('send an event via ipcRenderer', () => {
      (global as any).ipcRenderer = { send: jest.fn() };
      instance.openLogs(servers[1]);
      expect((global as any).ipcRenderer.send).toHaveBeenCalledWith('showDock', servers[1].id);
    });
  });

  describe('#openServer', () => {
    let instance: ServerList;
    let openLinkSpy: jest.SpyInstance;

    beforeEach(() => {
      instance = create().instance() as ServerList;
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
