import React, { Component } from 'react';
import HotelApi from '../api';
import { AppFooter, AppHeader, ServerList } from '../components';
import { Server, Status } from '../interfaces';

interface Props { }
interface HotelEvent { }
interface State {
  loading: boolean;
  servers: Server[];
}

class Main extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { loading: false, servers: [] };
  }

  componentDidMount() {
    this.loadServers();
    HotelApi.watchServers((servers: Server[]) => {
      this.serversLoaded(servers);
    });
    window.ipcRenderer.on('events', (e: Event, event: HotelEvent) => {
      this.serversLoaded(event);
    });
  }

  loadServers = () => {
    this.setState({ loading: true });
    return HotelApi.getServers().then(servers => {
      this.serversLoaded(servers);
    });
  }

  serversLoaded = (hotelServers: { [key: string]: any }) => {
    const servers: Server[] = Object.keys(hotelServers).sort().map(serverId => {
      const server: Server = hotelServers[serverId];
      return {
        id: serverId,
        status: server.status,
        env: server.env,
      };
    });
    this.setState({ loading: false, servers });
  }

  updateServerStatus = (id: string, status: Status) => {
    const servers = this.state.servers;
    const serverId = servers.findIndex(server => server.id === id);
    servers[serverId].status = status;
    this.setState({ servers });
  }

  render() {
    const { loading, servers } = this.state;
    return (
      <div className="main-container">
        <div className="header-arrow"/>
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
