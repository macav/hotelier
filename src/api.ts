import { Server } from './interfaces';

export default class HotelApi {
  getServers = (): Promise<Server[]> => {
    return fetch(`${HotelApi.getHotelUrl()}/_/servers`).then(
      async (response) => {
        if (response.ok) {
          return this.transformServersData(await response.json());
        } else {
          console.error('Failed to load the servers', response.body);
          return [];
        }
      }
    );
  };

  transformServersData = (data: any): Server[] => {
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

  watchServers = (cb: any) => {
    setInterval(() => this.getServers().then((data) => cb(data)), 3000);
  };

  static getHotelUrl = () => {
    // In development, we have a reverse proxy to localhost:2000 (see package.json)
    return process.env.NODE_ENV === 'development' ? '' : window.hotelUrl;
  };

  sendCommand = (id: string, command: string) => {
    return this.postData(
      `${HotelApi.getHotelUrl()}/_/servers/${id}/${command}`,
      null
    );
  };

  startServer = (id: string) => {
    return this.sendCommand(id, 'start');
  };

  stopServer = (id: string) => {
    return this.sendCommand(id, 'stop');
  };

  postData = (url: string, data: any) => {
    // console.log('post data', window.fetch);
    return fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  };
}
