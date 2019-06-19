import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { Server, Status } from '../interfaces';

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

  restartServer = (server: Server) => {
    server.status = Status.RESTARTING;
    this.setState({ server });
    this.props.restartServer(server);
    setTimeout(() => {
      server.status = Status.RUNNING;
      this.setState({ server });
    }, 1000);
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
              <CSSTransition
                title="Restart"
                in={[Status.RUNNING, Status.RESTARTING].includes(server.status)}
                unmountOnExit={true}
                classNames="server-item"
                timeout={{ enter: 350, exit: 350 }}
              >
                <button className="btn btn-secondary restart-button" onClick={() => this.restartServer(server)}>
                  <span className={`fas fa-redo ${server.status === Status.RESTARTING ? 'spin' : ''}`} />
                </button>
              </CSSTransition>
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
