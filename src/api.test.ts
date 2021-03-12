import HotelApi from './api';
import { Server, Status } from './interfaces';
import mockFetch from 'jest-fetch-mock';

describe('api', () => {
  let api: HotelApi;
  beforeEach(() => {
    api = new HotelApi();
  });

  describe('#getHotelUrl', () => {
    it('returns empty url when in development', () => {
      (process.env as any).NODE_ENV = 'development';
      expect(HotelApi.getHotelUrl()).toEqual('');
      (process.env as any).NODE_ENV = 'test';
    });

    it('returns empty url when in production', () => {
      (process.env as any).NODE_ENV = 'production';
      expect(HotelApi.getHotelUrl()).toEqual('http://localhost:2000');
      (process.env as any).NODE_ENV = 'test';
    });
  });

  describe('#getServers', () => {
    it('handles errors', async () => {
      console.error = jest.fn();
      mockFetch.mockResponse(null, { status: 404 });
      const servers = await api.getServers();
      expect(servers).toEqual([]);
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe('#watchServers', () => {
    beforeEach(() => jest.useFakeTimers());

    it('polls on servers', (done) => {
      const servers: Server[] = [{ id: 'server1', status: Status.RUNNING, env: {} }];
      const callback = jest.fn();
      jest.spyOn(api, 'getServers').mockReturnValue(Promise.resolve(servers));
      api.watchServers(callback);
      expect(setInterval).toHaveBeenCalledTimes(1);
      jest.runOnlyPendingTimers();
      process.nextTick(() => {
        expect(callback).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('#sendCommand', () => {
    it('uses postData method to send the command', () => {
      jest.spyOn(api, 'postData');
      api.sendCommand('server1', 'stop');
      expect(api.postData).toHaveBeenCalledWith(
        'http://localhost:2000/_/servers/server1/stop',
        null
      );
    });
  });

  describe('#startServer', () => {
    it('uses postData method to send the start command', () => {
      jest.spyOn(api, 'postData');
      api.startServer('server1');
      expect(api.postData).toHaveBeenCalledWith(
        'http://localhost:2000/_/servers/server1/start',
        null
      );
    });
  });

  describe('#stopServer', () => {
    it('uses postData method to send the stop command', () => {
      jest.spyOn(api, 'postData');
      api.stopServer('server1');
      expect(api.postData).toHaveBeenCalledWith(
        'http://localhost:2000/_/servers/server1/stop',
        null
      );
    });
  });

  describe('#postData', () => {
    it('calls fetch with POST method', async () => {
      const data = { test: true };

      mockFetch.mockResponse(JSON.stringify(data));
      const response = await api.postData('http://localhost', data);
      expect(window.fetch).toHaveBeenCalledWith('http://localhost', {
        body: JSON.stringify(data),
        headers: { 'content-type': 'application/json' },
        method: 'POST',
      });
      expect(response.body).toEqual(JSON.stringify(data));
    });
  });
});
