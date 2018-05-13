import api from './api';
import mockFetch from 'jest-fetch-mock';

describe('api', () => {
  describe('#getHotelUrl', () => {
    it('returns empty url when in development', () => {
      process.env.NODE_ENV = 'development';
      expect(api.getHotelUrl()).toEqual('');
      process.env.NODE_ENV = 'test';
    });

    it('returns empty url when in production', () => {
      process.env.NODE_ENV = 'production';
      expect(api.getHotelUrl()).toEqual('http://localhost:2000');
      process.env.NODE_ENV = 'test';
    });
  });

  describe('#sendCommand', () => {
    it('uses postData method to send the command', () => {
      jest.spyOn(api, 'postData');
      api.sendCommand('server1', 'stop');
      expect(api.postData).toHaveBeenCalledWith('http://localhost:2000/_/servers/server1/stop', null);
    });
  });

  describe('#startServer', () => {
    it('uses postData method to send the start command', () => {
      jest.spyOn(api, 'postData');
      api.startServer('server1');
      expect(api.postData).toHaveBeenCalledWith('http://localhost:2000/_/servers/server1/start', null);
    });
  });

  describe('#stopServer', () => {
    it('uses postData method to send the stop command', () => {
      jest.spyOn(api, 'postData');
      api.stopServer('server1');
      expect(api.postData).toHaveBeenCalledWith('http://localhost:2000/_/servers/server1/stop', null);
    });
  });

  describe('#postData', () => {
    it('calls fetch with POST method', done => {
      window.fetch = jest.fn();
      const data = { test: true };
      api.postData('http://localhost', data);
      expect(window.fetch).toHaveBeenCalledWith('http://localhost', {
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' },
        method: 'POST'
      });
      done();
    });
  });
});
