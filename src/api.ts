export default class HotelApi {
  static getServers = () => {
    return window.fetch(`${HotelApi.getHotelUrl()}/_/servers`).then(response => {
      if (response.ok) {
        return response.json();
      } else {
        return [];
      }
    });
  }

  static watchServers = (cb: any) => {
    setInterval(() => HotelApi.getServers().then(data => cb(data)), 3000);
  }

  static getHotelUrl = () => {
    // In development, we have a reverse proxy to localhost:2000 (see package.json)
    return process.env.NODE_ENV === 'development' ? '' : window.hotelUrl;
  }

  static sendCommand = (id: string, command: string) => {
    return HotelApi.postData(`${HotelApi.getHotelUrl()}/_/servers/${id}/${command}`, null);
  }

  static startServer = (id: string) => {
    return HotelApi.sendCommand(id, 'start');
  }

  static stopServer = (id: string) => {
    return HotelApi.sendCommand(id, 'stop');
  }

  static postData = (url: string, data: any) => {
    return fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }
}
