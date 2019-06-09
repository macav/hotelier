
export const RUNNING = 'running';
export const RESTARTING = 'restarting';
export const STOPPED = 'stopped';
export const CRASHED = 'crashed';

export default class HotelApi {
  static getServers = () => {
    return window.fetch(`${HotelApi.getHotelUrl()}/_/servers`).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return [];
      }
    });
  };

  static watchServers = (cb) => {
    setInterval(() => HotelApi.getServers().then(data => cb(data)), 3000);
  }

  static getHotelUrl = () => {
    // In development, we have a reverse proxy to localhost:2000 (see package.json)
    return process.env.NODE_ENV === 'development' ? '' : window.hotelUrl;
  }

  static sendCommand = (id, command) => {
    return HotelApi.postData(`${HotelApi.getHotelUrl()}/_/servers/${id}/${command}`, null);
  }

  static startServer = (id) => {
    return HotelApi.sendCommand(id, 'start');
  }

  static stopServer = (id) => {
    return HotelApi.sendCommand(id, 'stop');
  }

  static postData = (url, data) => {
    return fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }
}
