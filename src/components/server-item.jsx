import React from 'react';
import PropTypes from 'prop-types';
import { RUNNING, RESTARTING } from '../api';
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
        return 'btn-negative text-white';
      default:
        return 'tcon-transform btn-default';
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
      <li className="list-group-item server-item">
        <div className={`pull-left server-name server-name--${server.status}`} onClick={() => openServer(server)}>
          {server.id}
        </div>
        <div className="pull-right">
          <div className="d-inline">
            <CSSTransition in={[RUNNING, RESTARTING].includes(server.status)} unmountOnExit classNames="server-item" timeout={{ enter: 350, exit: 350 }}>
              <button className="btn btn-default mr-1 restart-button" onClick={() => this.restartServer(server)}>
                <span className={`icon icon-arrows-ccw ${server.status === RESTARTING ? 'spin' : ''}`}></span>
              </button>
            </CSSTransition>
          </div>
          <div className="d-inline">
            <button type="button" className={`btn ${this.actionClassName(server.status)}`} onClick={() => toggleServer(server)}>
              <span className={`tcon tcon-remove tcon-remove--chevron-right ${this.actionClassName(server.status)}`}></span>
            </button>
          </div>
          <div className="d-inline">
            <button type="button" className='btn-default' onClick={() => openLogs(server)}>
              L
            </button>
          </div>
        </div>
      </li>
    );
  }
}
