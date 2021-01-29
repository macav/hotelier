import React from 'react';
import HotelApi from '../api';
import { AppFooter, AppHeader, ServerList } from '../components';
import { Server, Status } from '../interfaces';

interface Props {}
interface HotelEvent {}
interface State {
  loading: boolean;
  servers: Server[];
}

class Main extends React.Component<Props, State> {
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
      this.serversLoaded(HotelApi.transformServersData(event));
    });
  }

  loadServers = () => {
    this.setState({ loading: true });
    return HotelApi.getServers().then((servers) => {
      this.setState({ loading: false, servers });
    });
  };

  serversLoaded = (servers: Server[]) => {
    this.setState({ loading: false, servers });
  };

  updateServerStatus = (id: string, status: Status) => {
    const servers = this.state.servers;
    const serverId = servers.findIndex((server) => server.id === id);
    servers[serverId].status = status;
    this.setState({ servers });
  };

  render() {
    const { loading, servers } = this.state;
    return (
      <div className="main-container">
        <div className="header-arrow" />
        <div className="window">
          <AppHeader />
          <div className="window-content">
            <div className="pane">
              {loading && <div className="summary">Loading&hellip;</div>}
              <ServerList
                servers={servers}
                loadServers={this.loadServers}
                updateServerStatus={this.updateServerStatus}
              />
            </div>
          </div>
          <AppFooter />
        </div>
      </div>
    );
  }
}

export default Main;
