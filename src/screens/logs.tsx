import React, { useContext, useEffect, useRef, useState } from 'react';
import uniqueId from 'lodash/uniqueId';
import { match } from 'react-router-dom';
import { formatLines } from '../formatter';
import ServerRestartButton from '../components/server-restart-button';
import HotelApi from '../api';
import { Server } from '../interfaces';
import { HotelContext } from './hotel-context';

interface Output {
  id: string;
  output: string;
}

interface Props {
  match: match<{ server: string }>;
}

const Logs: React.FC<Props> = ({ match }) => {
  const logsRef = useRef<HTMLPreElement>(null);
  const isAtBottom = useRef<boolean>(true);

  const { api } = useContext(HotelContext);

  const [logs, setLogs] = useState<{
    [key: string]: Array<{ id: string; html: string }>;
  }>({});

  const onScroll = () => {
    if (!logsRef.current) {
      return;
    }
    const { scrollHeight, scrollTop, clientHeight } = logsRef.current;
    isAtBottom.current = scrollHeight - scrollTop === clientHeight;
  };

  const scrollToBottomIfNecessary = () => {
    if (isAtBottom.current && logsRef.current) {
      logsRef.current.scrollTop = logsRef.current.scrollHeight;
    }
  };

  const watchRef = useRef(() => {
    window.ipcRenderer.on('output', (e: Event, output: Output) => {
      const lines = formatLines(output.output).map((html) => ({
        html,
        id: uniqueId(),
      }));
      const logInstance = [...(logs[output.id] || []), ...lines];
      logs[output.id] = logInstance;
      setLogs(logs);
      scrollToBottomIfNecessary();
    });
  });

  useEffect(() => {
    watchRef.current();
    logsRef.current?.addEventListener('scroll', onScroll);
  }, []);

  const clearLogs = () => {
    const appId = match.params.server;
    setLogs({ ...logs, [appId]: [] });
  };

  const appId = match.params.server;
  const currentLogs = logs[appId] || [];
  return (
    <div className="h-100">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top py-1">
        <div className="mr-auto font-weight-bold text-center text-white">
          {appId} logs
        </div>
        <ServerRestartButton btnStyle="btn-primary" serverId={appId} />
        <button
          className="btn btn-primary"
          title="Clear logs"
          onClick={clearLogs}
        >
          <i className="fas fa-eraser" />
        </button>
      </nav>
      <pre className="logs-window" ref={logsRef}>
        {currentLogs.map((log) => (
          <div key={log.id} dangerouslySetInnerHTML={{ __html: log.html }} />
        ))}
      </pre>
    </div>
  );
};

export default Logs;
