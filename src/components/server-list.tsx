import React, { Component, useContext } from 'react';
import { Server, Status } from '../interfaces';
import { HotelContext } from '../screens/hotel-context';
import utils from '../utils';
import ServerItem from './server-item';

interface Props {}

export const ServerList: React.FC<Props> = (props: Props) => {
  const { api, servers, updateServerStatus } = useContext(HotelContext);

  const startServer = (id: string) => {
    api.startServer(id).then(() => updateServerStatus!(id, Status.RUNNING));
  };

  const stopServer = (id: string) => {
    api.stopServer(id).then(() => updateServerStatus!(id, Status.STOPPED));
  };

  const toggleServer = (server: Server) => {
    if ([Status.STOPPED, Status.CRASHED].includes(server.status)) {
      startServer(server.id);
    } else {
      stopServer(server.id);
    }
  };

  const openServer = (server: Server) => {
    let serverUrl = `http://${server.id}.${window.hotelTld}`;
    if (server.env.PORT) {
      serverUrl += `:${server.env.PORT}`;
    }
    utils.openExternalLink(serverUrl);
  };

  const openLogs = (server: Server) => {
    window.ipcRenderer.send('showDock', server.id);
  };

  return (
    <div>
      <ul className="list-group">
        {servers.map((server) => {
          return (
            <ServerItem
              key={server.id}
              server={server}
              toggleServer={toggleServer}
              openLogs={openLogs}
              openServer={openServer}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default ServerList;
