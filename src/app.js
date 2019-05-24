import React, { Component } from 'react';
import './app.css';
import { AppFooter, AppHeader, ServerList } from './components';
import HotelApi from './api';
import { HashRouter as Router, Route } from 'react-router-dom';
import { formatLines } from './formatter';
import uniqueId from 'lodash/uniqueId'

class Logs extends Component {
  constructor(props) {
    super(props);
    this.state = { logs: {} };
    this.onScroll = this.onScroll.bind(this);
    this.isAtBottom = true;
  }

  componentDidMount() {
    this.watch();
    window.addEventListener('scroll', this.onScroll);
  }

  scrollToBottomIfNecessary() {
    if (this.isAtBottom) {
      window.scrollTo(0, document.documentElement.scrollHeight);
    }
  }

  onScroll() {
    this.isAtBottom = document.documentElement.scrollHeight === document.documentElement.scrollTop + document.documentElement.clientHeight;
  }

  watch = () => {
    HotelApi.watch((output) => console.log('events', output));
    HotelApi.watchOutput((output) => {
      const { logs } = this.state;
      const lines = formatLines(output.output).map(html => ({ html, id: uniqueId() }));
      const logInstance = [...(logs[output.id] || []), ...lines];
      this.setState({ logs: { ...logs, [output.id]: logInstance } });
      this.scrollToBottomIfNecessary();
    });
  }

  render() {
    const appId = this.props.match.params.server;
    const logs = this.state.logs[appId] || [];
    return (
      <pre>
        {logs.map(log => (
          <div key={log.id} dangerouslySetInnerHTML={{ __html: log.html }}></div>
        ))}
      </pre>
    );
  }
};

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
class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path='/' component={Main} />
          <Route exact path='/logs/:server' component={Logs} />
        </div>
      </Router >
    );
  }
}

export default App;
