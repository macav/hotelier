import React, { Component } from 'react';
import { AppFooter, AppHeader, ServerList } from '../components';
import HotelApi from '../api';

class Main extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: false, servers: [], logs: {} };
  }

  componentDidMount() {
    this.loadServers();
    HotelApi.watchServers(servers => {
      this.serversLoaded(servers);
    });
    window.ipcRenderer.on('events', (_e, event) => {
      this.serversLoaded(event);
    });
  }

  loadServers = () => {
    this.setState({ loading: true });
    return HotelApi.getServers().then(servers => {
      this.serversLoaded(servers);
    });
  };

  serversLoaded = (servers) => {
    servers = Object.keys(servers).map(serverId => {
      const server = servers[serverId];
      return {
        id: serverId,
        status: server.status,
        env: server.env,
      };
    });
    this.setState({ loading: false, servers });
  }

  updateServerStatus = (id, status) => {
    const servers = this.state.servers;
    const serverId = servers.findIndex(server => server.id === id);
    servers[serverId].status = status;
    this.setState({ servers });
  }

  render() {
    const { loading, servers } = this.state;
    return (
      <div>
        <div className="header-arrow"></div>
        <div className="window">
          <AppHeader />
          <div className="window-content">
            <div className="pane">
              {loading && (<div className="summary">Loading&hellip;</div>)}
              <ServerList servers={servers} loadServers={this.loadServers} updateServerStatus={this.updateServerStatus} />
            </div>
          </div>
          <AppFooter />
        </div>
      </div>
    );
  }
}

export default Main;
