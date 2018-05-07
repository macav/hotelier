import React, { Component } from 'react';
import './app.css';
import isElectron from 'is-electron';

class App extends Component {
  constructor() {
    super();
    this.state = { loading: true, servers: [] };
  }

  componentDidMount() {
    this.loadServers();
  }

  loadServers = () => {
    this.setState({ loading: true });
    this.getServers().then(servers => {
      servers = Object.keys(servers).map(serverId => {
        const server = servers[serverId];

        return {
          id: serverId,
          status: server.status,
        };
      });
      this.setState({ servers });
    });
  };

  getServers = () => {
    return window.fetch(`${this.getHotelUrl()}/_/servers`).then(response => {
      this.setState({ loading: false });
      if (response.ok) {
        return response.json();
      } else {
        return [];
      }
    });
  };

  getHotelUrl = () => {
    return process.env.NODE_ENV === 'development' ? '' : 'http://localhost:2000';
  }

  sendCommand = (id, command) => {
    return this.postData(`${this.getHotelUrl()}/_/servers/${id}/${command}`, null);
  }

  startServer = (id) => {
    this.sendCommand(id, 'start').then(() => this.updateServerStatus(id, 'running'));
  }

  updateServerStatus = (id, status) => {
    const servers = this.state.servers;
    const serverId = servers.findIndex(server => server.id === id);
    servers[serverId].status = status;
    this.setState({ servers });
  }

  stopServer = (id) => {
    this.sendCommand(id, 'stop').then(() => this.updateServerStatus(id, 'stopped'));
  }

  toggleServer = (server) => {
    if (server.status === 'stopped') {
      this.startServer(server.id);
    } else {
      this.stopServer(server.id);
    }
  }

  postData = (url, data) => {
    return fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  }

  actionName = (status) => {
    switch (status) {
      case 'stopped':
        return 'Start';
      case 'running':
        return 'Stop';
      default:
        return '';
    }
  }

  actionClassName = (status) => {
    switch (status) {
      case 'stopped':
        return 'btn btn-positive'
      case 'running':
        return 'btn btn-negative';
      default:
        return 'btn';
    }
  }

  openExternalLink = (url) => {
    if (isElectron()) {
      window.shell.openExternal(url);
    } else {
      window.open(url);
    }
  }

  openServer = (server) => {
    this.openExternalLink(`http://${server.id}.localhost`);
    setTimeout(() => this.loadServers(), 1000);
  }

  openHotel = () => {
    this.openExternalLink('http://localhost:2000');
  }

  render() {
    return (
      <div>
        <div className="header-arrow"></div>
        <div className="window">
          <header className="toolbar toolbar-header">
            <h1 className="title">Hotelier</h1>
          </header>
          <div className="window-content">
            <div className="pane">
              {this.state.loading && (<div className="summary js-loading">Loading&hellip;</div>)}
              <table>
                <thead>
                  <tr>
                    <th>Server</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody id="server-list">
                  {this.state.servers.map(server => {
                    return (
                      <tr key={server.id}>
                        <td onClick={() => this.openServer(server)}>{server.id}</td>
                        <td>{server.status}</td>
                        <td>
                          <button className={this.actionClassName(server.status)} onClick={() => this.toggleServer(server)}>
                            {this.actionName(server.status)}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <footer className="toolbar toolbar-footer">

            <div className="toolbar-actions pull-left">
              <button className="btn btn-default" onClick={this.openHotel}>Hotel</button>
            </div>

            <div className="toolbar-actions pull-right">
              <div className="btn-group">
                <button className="btn btn-default" onClick={() => this.loadServers()}>
                  <span className="icon icon-arrows-ccw" title="Refresh"></span>
                </button>

                <button className="btn btn-default" onClick={() => window.close()}>
                  <span className="icon icon-cancel" title="Quit"></span>
                </button>
              </div>
            </div>

          </footer>
        </div>
      </div>
    );
  }
}

export default App;
