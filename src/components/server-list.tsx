import React, { Component } from 'react';
import HotelApi from '../api';
import { Server, Status } from '../interfaces';
import utils from '../utils';
import ServerItem from './server-item';

interface Props {
  loadServers: () => void;
  updateServerStatus: (id: string, status: Status) => void;
  servers: Server[];
}

export default class ServerList extends Component<Props> {
  private api: HotelApi;

  constructor(props: Props) {
    super(props);
    this.api = new HotelApi();
  }

  startServer = (id: string) => {
    this.api
      .startServer(id)
      .then(() => this.props.updateServerStatus(id, Status.RUNNING));
  };

  stopServer = (id: string) => {
    this.api
      .stopServer(id)
      .then(() => this.props.updateServerStatus(id, Status.STOPPED));
  };

  restartServer = async (server: Server) => {
    await this.api.stopServer(server.id);
    await this.api.startServer(server.id);
  };

  toggleServer = (server: Server) => {
    if ([Status.STOPPED, Status.CRASHED].includes(server.status)) {
      this.startServer(server.id);
    } else {
      this.stopServer(server.id);
    }
  };

  openServer = (server: Server) => {
    let serverUrl = `http://${server.id}.${window.hotelTld}`;
    if (server.env.PORT) {
      serverUrl += `:${server.env.PORT}`;
    }
    utils.openExternalLink(serverUrl);
    this.props.loadServers();
  };

  openLogs = (server: Server) => {
    window.ipcRenderer.send('showDock', server.id);
  };

  render() {
    return (
      <div>
        <ul className="list-group">
          {this.props.servers.map((server) => {
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
