import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ServerItem from './server-item';
import HotelApi, { STOPPED, RUNNING } from '../api';
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

  restartServer = async(server) => {
    await HotelApi.stopServer(server.id);
    await HotelApi.startServer(server.id);
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
        <ul className="list-group">
          {this.props.servers.map(server => {
            return (
              <ServerItem key={server.id} server={server} toggleServer={this.toggleServer} openServer={this.openServer}
                restartServer={this.restartServer}/>
            );
          })}
        </ul>
      </div>
    );
  }
}
