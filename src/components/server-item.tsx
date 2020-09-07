import React from 'react';
import { Server, Status } from '../interfaces';
import ServerRestartButton from './server-restart-button';

interface Props {
  server: Server;
  restartServer: (server: Server) => void;
  openServer: (server: Server) => void;
  toggleServer: (server: Server) => void;
  openLogs: (server: Server) => void;
}

interface State {
  server: Server;
}

export default class ServerItem extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      server: this.props.server,
    };
  }

  componentDidUpdate() {
    const { server } = this.state;
    if (server.status !== this.props.server.status && server.status !== Status.RESTARTING) {
      this.setState({ server: this.props.server });
    }
  }

  actionClassName = (status: string) => {
    switch (status) {
      case Status.RUNNING:
      case Status.RESTARTING:
        return 'btn-danger text-white';
      default:
        return 'btn-light';
    }
  }

  actionIconClassName = (status: string) => {
    switch (status) {
      case Status.STOPPED:
      case Status.CRASHED:
        return 'tcon-transform';
      default:
        return '';
    }
  }

  render() {
    const { openServer, toggleServer, openLogs } = this.props;
    const { server } = this.state;
    return (
      <li className="list-group-item list-group-item-action server-item">
        <div className="d-flex justify-content-between">
          <div className={`server-name server-name--${server.status}`} onClick={() => openServer(server)}>
            {server.id}
          </div>
          <div className="float-right">
            <div className="d-inline">
              <ServerRestartButton server={server} />
            </div>
            <div className="d-inline mx-1">
              <button
                type="button"
                title="Toggle"
                className={`btn toggle-state-button ${this.actionClassName(server.status)}`}
                onClick={() => toggleServer(server)}
              >
                <span className={`tcon tcon-remove tcon-remove--chevron-right ${this.actionIconClassName(server.status)}`} />
              </button>
            </div>
            <div className="d-inline">
              <button type="button" className="btn btn-light mr-1" title="Logs" onClick={() => openLogs(server)}>
                <i className="fas fa-bars" />
              </button>
            </div>
          </div>
        </div>
      </li>
    );
  }
}
