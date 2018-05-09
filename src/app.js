import React, { Component } from 'react';
import './app.css';
import { AppFooter, AppHeader, ServerList } from './components';
import HotelApi from './api';

class App extends Component {
  constructor() {
    super();
    this.state = { loading: false, servers: [] };
  }

  loadServers = () => {
    this.setState({ loading: true });
    HotelApi.getServers().then(servers => {
      this.setState({ loading: false });
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
          <AppHeader/>
          <div className="window-content">
            <div className="pane">
              {loading && (<div className="summary">Loading&hellip;</div>)}
              <ServerList servers={servers} loadServers={this.loadServers} updateServerStatus={this.updateServerStatus}/>
            </div>
          </div>
          <AppFooter reload={this.loadServers}/>
        </div>
      </div>
    );
  }
}

export default App;
