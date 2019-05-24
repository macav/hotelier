import React, { Component } from 'react';
import './app.css';
import { AppFooter, AppHeader, ServerList } from './components';
import HotelApi from './api';
import { HashRouter as Router, Route } from 'react-router-dom';

class Logs extends Component {
  render() {
    return <div>Logs</div>;
  }
};

class Main extends Component {
  constructor() {
    super();
    this.state = { loading: false, servers: [] };
  }

  componentDidMount() {
    this.loadServers();
    HotelApi.watchServers(servers => {
      this.serversLoaded(servers);
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
      };
    });
    this.setState({ loading: false, servers });
  }

  watch = () => {
    HotelApi.watch((output) => console.log('events', output));
    HotelApi.watchOutput((output) => console.log('output', output));
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
          <button onClick={this.watch}>watch</button>
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
class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path='/' component={Main} />
          <Route exact path='/logs' component={Logs} />
        </div>
      </Router >
    );
  }
}

export default App;
