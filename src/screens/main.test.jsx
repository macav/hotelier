import React from 'react';
import Main from './main';
import renderer from 'react-test-renderer';

import mockFetch from 'jest-fetch-mock';
import HotelApi from '../api';

jest.mock('react-transition-group');

describe('Main', () => {
  const mockServers = { server1: { status: "running" }, server2: { status: "stopped" } };

  function mockSuccessfulResponse() {
    mockFetch.mockResponse(JSON.stringify(mockServers));
  }

  it('matches the snapshot', done => {
    mockSuccessfulResponse();
    const rendered = renderer.create(<Main />);
    expect(rendered.toJSON()).toMatchSnapshot('loading');
    process.nextTick(() => {
      expect(rendered.toJSON()).toMatchSnapshot('loaded');
      done();
    });
  });

  it('updates the state with the servers loaded from the API', done => {
    mockSuccessfulResponse();
    const instance = renderer.create(<Main />).getInstance();
    expect(instance.state.loading).toBe(true);
    process.nextTick(() => {
      expect(instance.state.servers.length).toEqual(2);
      expect(instance.state.servers[0].id).toEqual('server1');
      expect(instance.state.servers[0].status).toEqual('running');
      expect(instance.state.servers[1].id).toEqual('server2');
      expect(instance.state.servers[1].status).toEqual('stopped');
      expect(instance.state.loading).toBe(false);
      done();
    });
  });

  it('adds a new server to the state', () => {
    mockSuccessfulResponse();
    let watchServersCallback;
    HotelApi.watchServers = jest.fn().mockImplementation(callback => watchServersCallback = callback);
    const instance = renderer.create(<Main />).getInstance();
    watchServersCallback({ server3: { status: 'running' } });
    expect(instance.state.servers.length).toEqual(1);
    expect(instance.state.servers[0].id).toEqual('server3');
    expect(instance.state.servers[0].status).toEqual('running');
    expect(instance.state.loading).toBe(false);
  });

  it('reloads servers on event', () => {
    global.ipcRenderer = { on: (_name, callback) => callback(null, { ...mockServers, server3: { status: 'running' } }) };
    const instance = renderer.create(<Main />).getInstance();
    expect(instance.state.servers.length).toEqual(3);
    expect(instance.state.servers).toEqual(jasmine.arrayContaining([jasmine.objectContaining({ id: 'server3' })]));
  });

  it('renders empty list when we get error from the api', done => {
    try {
      mockFetch.mockResponse('', { status: 500 });
      const instance = renderer.create(<Main />).getInstance();
      process.nextTick(() => {
        expect(instance.state.servers).toEqual([]);
        done();
      });
    } catch (e) {
      done();
    }
  });

  describe('#updateServerStatus', () => {
    beforeEach(() => {
      mockSuccessfulResponse();
    });

    it('updates the corresponding server with the new status', done => {
      const instance = renderer.create(<Main />).getInstance();
      process.nextTick(() => {
        instance.updateServerStatus('server1', 'stopped');
        expect(instance.state.servers[0].status).toEqual('stopped');
        done();
      });
    });
  });
});
