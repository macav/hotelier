import React from 'react';
import App from './app';
import renderer from 'react-test-renderer';

import mockFetch from 'jest-fetch-mock';

describe('App', () => {
  function mockSuccessfulResponse() {
    mockFetch.mockResponse('{"server1":{"status":"running"},"server2":{"status":"stopped"}}');
  }

  it('matches the snapshot', done => {
    mockSuccessfulResponse();
    const rendered = renderer.create(<App/>);
    expect(rendered.toJSON()).toMatchSnapshot('loading');
    process.nextTick(() => {
      expect(rendered.toJSON()).toMatchSnapshot('loaded');
      done();
    });
  });

  it('updates the state with the servers loaded from the API', done => {
    mockSuccessfulResponse();
    const instance = renderer.create(<App/>).getInstance();
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

  it('renders empty list when we get error from the api', done => {
    try {
      mockFetch.mockResponse('', { status: 500 });
      const instance = renderer.create(<App/>).getInstance();
      process.nextTick(() => {
        expect(instance.state.servers).toEqual([]);
        done();
      });
    } catch (e) {
      done();
    }
  });

  describe('#updateServerStatus', () => {
    beforeEach(() => mockSuccessfulResponse());

    it('updates the corresponding server with the new status', done => {
      const instance = renderer.create(<App/>).getInstance();
      process.nextTick(() => {
        instance.updateServerStatus('server1', 'stopped');
        expect(instance.state.servers[0].status).toEqual('stopped');
        done();
      });
    });
  });
});
