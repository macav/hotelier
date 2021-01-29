import React, { useContext, useEffect, useState } from 'react';
import { Status, Server } from '../interfaces';
import { CSSTransition } from 'react-transition-group';
import { HotelContext } from '../screens/hotel-context';

interface Props {
  serverId: string;
  btnStyle?: string;
}

export const ServerRestartButton: React.FC<Props> = ({
  serverId,
  btnStyle,
}) => {
  const { api, servers } = useContext(HotelContext);

  const [server, setServer] = useState<Server | undefined>(undefined);

  useEffect(() => {
    setServer(servers.find((server) => server.id === serverId)!);
  }, [serverId]);

  const restartServer = async () => {
    server!.status = Status.RESTARTING;
    setServer(server);
    await api.stopServer(server!.id);
    await api.startServer(server!.id);
    setTimeout(() => {
      server!.status = Status.RUNNING;
      setServer(server);
    }, 1000);
  };

  return server === undefined ? null : (
    <CSSTransition
      title="Restart"
      in={[Status.RUNNING, Status.RESTARTING].includes(server!.status)}
      unmountOnExit={true}
      classNames="server-item"
      timeout={{ enter: 350, exit: 350 }}
    >
      <button
        className={`btn ${btnStyle || 'btn-secondary'} restart-button`}
        onClick={restartServer}
      >
        <span
          className={`fas fa-redo ${
            server!.status === Status.RESTARTING ? 'spin' : ''
          }`}
        />
      </button>
    </CSSTransition>
  );
};

export default ServerRestartButton;
