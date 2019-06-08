import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ServerItem from './server-item';
import HotelApi, { STOPPED, RUNNING, CRASHED } from '../api';
import utils from '../utils';

export default class ServerList extends Component {
  static propTypes = {
    updateServerStatus: PropTypes.func,
    loadServers: PropTypes.func,
    servers: PropTypes.array,
  }

  startServer = (id) => {
    HotelApi.startServer(id).then(() => this.props.updateServerStatus(id, RUNNING));
  }

  stopServer = (id) => {
    HotelApi.stopServer(id).then(() => this.props.updateServerStatus(id, STOPPED));
  }

  restartServer = async (server) => {
    await HotelApi.stopServer(server.id);
    await HotelApi.startServer(server.id);
  }

  toggleServer = (server) => {
    if ([STOPPED, CRASHED].includes(server.status)) {
      this.startServer(server.id);
    } else {
      this.stopServer(server.id);
    }
  }

  openServer = (server) => {
    let serverUrl = `http://${server.id}.${window.hotelTld}`;
    if (server.env.PORT) {
      serverUrl += `:${server.env.PORT}`;
    }
    utils.openExternalLink(serverUrl);
    this.props.loadServers();
  }

  openLogs = (server) => {
    window.ipcRenderer.send('showDock', server.id);
  }

  render() {
    return (
      <div>
        <ul className="list-group">
          {this.props.servers.map(server => {
            return (
              <ServerItem
                key={server.id}
                server={server}
                toggleServer={this.toggleServer}
                openLogs={this.openLogs}
                openServer={this.openServer}
                restartServer={this.restartServer}
              />
            );
          })}
        </ul>
      </div>
    );
  }
}
