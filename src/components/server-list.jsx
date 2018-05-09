import React, { Component } from 'react';
import ServerItem from './server-item';
import HotelApi, { STOPPED, RUNNING } from '../api';
import utils from '../utils';

export default class ServerList extends Component {
  componentDidMount() {
    this.props.loadServers();
  }

  startServer = (id) => {
    HotelApi.startServer(id).then(() => this.props.updateServerStatus(id, RUNNING));
  }

  stopServer = (id) => {
    HotelApi.stopServer(id).then(() => this.props.updateServerStatus(id, STOPPED));
  }

  toggleServer = (server) => {
    if (server.status === STOPPED) {
      this.startServer(server.id);
    } else {
      this.stopServer(server.id);
    }
  }

  openServer = (server) => {
    utils.openExternalLink(`http://${server.id}.localhost`);
    setTimeout(() => this.props.loadServers(), 1000);
  }

  render() {
    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>Server</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {this.props.servers.map(server => {
              return (
                <ServerItem key={server.id} server={server} toggleServer={this.toggleServer} openServer={this.openServer} />
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}
