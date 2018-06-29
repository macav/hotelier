import React from 'react';
import PropTypes from 'prop-types';
import { RUNNING } from '../api';

export default class ServerItem extends React.Component {
  static propTypes = {
    server: PropTypes.object,
    openServer: PropTypes.func,
    toggleServer: PropTypes.func,
  }

  actionClassName = (status) => {
    switch (status) {
      case RUNNING:
        return 'btn-negative text-white';
      default:
        return 'tcon-transform btn-default';
    }
  }

  render() {
    const { server, openServer, toggleServer } = this.props;
    return (
      <li className="list-group-item server-item">
        <div className={`pull-left server-name server-name--${server.status}`} onClick={() => openServer(server)}>{server.id}</div>
        <div className="pull-right">
          <button className={`btn btn-default mr-1 ${server.status === 'running' ? 'd-inline' : 'd-none'}`} onClick={() => toggleServer(server)}>
            <span className='icon icon-arrows-ccw'></span>
          </button>
          <button type="button" className={`animated btn ${this.actionClassName(server.status)}`} aria-label="toggle status" onClick={() => toggleServer(server)}>
            <span className="tcon-visuallyhidden">toggle status</span>
            <span className={`tcon tcon-remove tcon-remove--chevron-right ${this.actionClassName(server.status)}`}></span>
          </button>
        </div>
      </li>
    );
  }
}
