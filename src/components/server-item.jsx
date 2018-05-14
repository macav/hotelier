import React from 'react';
import { STOPPED, RUNNING } from '../api';

export default class ServerItem extends React.Component {
  actionName = (status) => {
    switch (status) {
      case STOPPED:
        return 'Start';
      case RUNNING:
        return 'Stop';
      default:
        return '';
    }
  }

  actionClassName = (status) => {
    switch (status) {
      case STOPPED:
        return 'btn btn-positive'
      case RUNNING:
        return 'btn btn-negative';
      default:
        return 'btn';
    }
  }

  render() {
    const { server, openServer, toggleServer } = this.props;
    return (
      <tr>
        <td onClick={() => openServer(server)}>{server.id}</td>
        <td>
          <button className={this.actionClassName(server.status)} onClick={() => toggleServer(server)}>
            {this.actionName(server.status)}
          </button>
        </td>
      </tr>
    );
  }
}
