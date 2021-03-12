import React, { Component } from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import HotelApi from './api';
import './app.scss';
import { Server, Status } from './interfaces';
import { HotelContext } from './screens/hotel-context';
import Logs from './screens/logs';
import Main from './screens/main';
import Utils from './utils';

interface State {
  loading: boolean;
  servers: Server[];
}

class App extends Component<{}, State> {
  private api: HotelApi;

  constructor(props: {}) {
    super(props);
    this.api = new HotelApi();
    this.state = { loading: false, servers: [] };
  }

  componentDidMount() {
    this.loadServers();
    this.api.watchServers((servers: Server[]) => {
      this.serversLoaded(servers);
    });
    window.ipcRenderer.on('events', (e: Event, event: {}) => {
      this.serversLoaded(this.api.transformServersData(event));
    });
  }

  loadServers = () => {
    this.setState({ loading: true });
    return this.api.getServers().then((servers) => {
      this.serversLoaded(servers);
    });
  };

  updateServerStatus = (id: string, status: Status) => {
    const { servers } = this.state;
    const serverId = servers.findIndex((server) => server.id === id);
    servers[serverId].status = status;
    this.setState({ servers });
  };

  serversLoaded = (servers: Server[]) => {
    this.setState({ loading: false, servers: Utils.sortServers(servers) });
  };

  render() {
    return (
      <HotelContext.Provider
        value={{
          servers: this.state.servers,
          api: this.api,
          updateServerStatus: this.updateServerStatus,
        }}
      >
        <Router>
          <div className="h-100">
            <Route exact={true} path="/" component={Main} />
            <Route exact={true} path="/logs/:server" component={Logs} />
          </div>
        </Router>
      </HotelContext.Provider>
    );
  }
}

export default App;
