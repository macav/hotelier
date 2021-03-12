import React, { useContext, useEffect, useState } from 'react';
import { Status, Server } from '../interfaces';
import { CSSTransition } from 'react-transition-group';
import { HotelContext } from '../screens/hotel-context';

interface Props {
  server: Server;
  btnStyle?: string;
}

export const ServerRestartButton: React.FC<Props> = ({ server, btnStyle }) => {
  const { api } = useContext(HotelContext);
  const [restarting, setRestarting] = useState(false);

  const restartServer = async () => {
    setRestarting(true);
    await api.stopServer(server!.id);
    await api.startServer(server!.id);
    setTimeout(() => setRestarting(false), 1000);
  };

  return (
    <CSSTransition
      title="Restart"
      in={[Status.RUNNING].includes(server.status)}
      unmountOnExit={true}
      classNames="server-item"
      timeout={{ enter: 350, exit: 350 }}
    >
      <button
        className={`btn ${btnStyle || 'btn-secondary'} restart-button`}
        onClick={restartServer}
      >
        <span
          data-testid="restart-icon"
          className={`fas fa-redo ${restarting ? 'spin' : ''}`}
        />
      </button>
    </CSSTransition>
  );
};

export default ServerRestartButton;
