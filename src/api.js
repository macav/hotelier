export const RUNNING = 'running';
export const RESTARTING = 'restarting';
export const STOPPED = 'stopped';
export const CRASHED = 'crashed';
export const HOTEL_URL = 'http://localhost:2000';

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

  static watch = (cb) => {
    if (window.EventSource) {
      new window.EventSource(`${HOTEL_URL}/_/events`).onmessage = (event) => {
        const data = JSON.parse(event.data)
        cb(data);
      }
    } else {
      console.log('no EventSource support');
    }
  }

  static watchOutput = (cb) => {
    if (window.EventSource) {
      new window.EventSource(`${HOTEL_URL}/_/events/output`).onmessage = (event) => {
        const data = JSON.parse(event.data)
        cb(data);
      }
    } else {
      console.log('no EventSource support');
    }
  }

  static watchServers = (cb) => {
    setInterval(() => HotelApi.getServers().then(data => cb(data)), 3000);
  }

  static getHotelUrl = () => {
    return process.env.NODE_ENV === 'development' ? '' : HOTEL_URL;
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
