import React from 'react';
import ServerList from './server-list';
import utils from '../utils';
import { shallow } from 'enzyme';
import hotelApi, { STOPPED, RUNNING } from '../api';

describe('ServerList', () => {
  const servers = [
    { id: 'test-server-1', status: 'running' },
    { id: 'test-server-2', status: 'stopped' },
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

  it('can open server and reload servers afterwards', () => {
    jest.useFakeTimers();
    const instance = create().instance();
    jest.spyOn(utils, 'openExternalLink');
    instance.openServer(servers[0]);
    expect(utils.openExternalLink).toHaveBeenCalledWith('http://test-server-1.localhost');
    loadServersFn.mockClear();
    jest.runAllTimers();
    expect(loadServersFn).toHaveBeenCalled();
  });
});
