import { Server } from './interfaces';

export default class HotelApi {
  static getServers = (): Promise<Server[]> => {
    return window
      .fetch(`${HotelApi.getHotelUrl()}/_/servers`)
      .then(async (response) => {
        if (response.ok) {
          return HotelApi.transformServersData(await response.json());
        } else {
          console.error('Failed to load the servers', response.body);
          return [];
        }
      });
  };

  static transformServersData = (data: any): Server[] => {
    return Object.keys(data)
      .sort()
      .map((serverId) => {
        const server: Server = data[serverId];
        return {
          id: serverId,
          status: server.status,
          env: server.env,
        };
      });
  };

  static watchServers = (cb: any) => {
    setInterval(() => HotelApi.getServers().then((data) => cb(data)), 3000);
  };

  static getHotelUrl = () => {
    // In development, we have a reverse proxy to localhost:2000 (see package.json)
    return process.env.NODE_ENV === 'development' ? '' : window.hotelUrl;
  };

  static sendCommand = (id: string, command: string) => {
    return HotelApi.postData(
      `${HotelApi.getHotelUrl()}/_/servers/${id}/${command}`,
      null
    );
  };

  static startServer = (id: string) => {
    return HotelApi.sendCommand(id, 'start');
  };

  static stopServer = (id: string) => {
    return HotelApi.sendCommand(id, 'stop');
  };

  static postData = (url: string, data: any) => {
    return fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  };
}
