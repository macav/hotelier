import React from 'react';
import HotelApi from '../api';
import { Status, Server } from '../interfaces';
import { CSSTransition } from 'react-transition-group';

interface Props {
  server: Server;
  btnStyle?: string;
}

export default class ServerRestartButton extends React.Component<Props> {
  restartServer = async () => {
    const { server } = this.props;

    server.status = Status.RESTARTING;
    this.setState({ server });
    await HotelApi.stopServer(server.id);
    await HotelApi.startServer(server.id);
    setTimeout(() => {
      server.status = Status.RUNNING;
      this.setState({ server });
    }, 1000);
  }

  render() {
    const { server, btnStyle } = this.props;
    return (
      <CSSTransition
        title="Restart"
        in={[Status.RUNNING, Status.RESTARTING].includes(server.status)}
        unmountOnExit={true}
        classNames="server-item"
        timeout={{ enter: 350, exit: 350 }}
      >
        <button className={`btn ${btnStyle || 'btn-secondary'} restart-button`} onClick={this.restartServer}>
          <span className={`fas fa-redo ${server.status === Status.RESTARTING ? 'spin' : ''}`} />
        </button>
      </CSSTransition>
    );
  }
}
