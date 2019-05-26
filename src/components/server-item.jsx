import React from 'react';
import PropTypes from 'prop-types';
import { RUNNING, RESTARTING, STOPPED } from '../api';
import { CSSTransition } from 'react-transition-group';

export default class ServerItem extends React.Component {
  static propTypes = {
    server: PropTypes.object,
    openServer: PropTypes.func,
    toggleServer: PropTypes.func,
    restartServer: PropTypes.func,
    openLogs: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      server: this.props.server,
    };
  }

  componentDidUpdate() {
    const { server } = this.state;
    if (server.status !== this.props.server.status && server.status !== RESTARTING) {
      this.setState({ server: this.props.server });
    }
  }

  actionClassName = (status) => {
    switch (status) {
      case RUNNING:
      case RESTARTING:
        return 'btn-danger text-white';
      default:
        return 'btn-light';
    }
  }

  actionIconClassName = (status) => {
    switch (status) {
      case STOPPED:
        return 'tcon-transform';
      default:
        return '';
    }
  }

  restartServer = (server) => {
    server.status = RESTARTING;
    this.setState({ server });
    this.props.restartServer(server);
    setTimeout(() => {
      server.status = RUNNING;
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
              <CSSTransition title="Restart" in={[RUNNING, RESTARTING].includes(server.status)} unmountOnExit classNames="server-item" timeout={{ enter: 350, exit: 350 }}>
                <button className="btn btn-secondary restart-button" onClick={() => this.restartServer(server)}>
                  <span className={`fas fa-redo ${server.status === RESTARTING ? 'spin' : ''}`}></span>
                </button>
              </CSSTransition>
            </div>
            <div className="d-inline mx-1">
              <button type="button" title="Toggle" className={`btn toggle-state-button ${this.actionClassName(server.status)}`} onClick={() => toggleServer(server)}>
                <span className={`tcon tcon-remove tcon-remove--chevron-right ${this.actionIconClassName(server.status)}`}></span>
              </button>
            </div>
            <div className="d-inline">
              <button type="button" className='btn btn-light mr-1' title="Logs" onClick={() => openLogs(server)}>
                <i className="fas fa-bars"></i>
            </button>
            </div>
          </div>
        </div>
      </li>
    );
  }
}
