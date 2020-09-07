import uniqueId from 'lodash/uniqueId';
import React, { Component } from 'react';
import { match } from 'react-router-dom';
import { formatLines } from '../formatter';
import ServerRestartButton from '../components/server-restart-button';
import HotelApi from '../api';
import { Server } from '../interfaces';

interface Output {
  id: string;
  output: string;
}

interface Props {
  match: match<{ server: string }>;
}

interface State {
  logs: { [key: string]: Array<{ id: string, html: string }> };
  server?: Server;
}

class Logs extends Component<Props, State> {
  isAtBottom: boolean;
  logsRef: HTMLPreElement | null = null;

  constructor(props: Props) {
    super(props);
    this.state = { logs: {} };
    this.onScroll = this.onScroll.bind(this);
    this.isAtBottom = true;
  }

  componentDidMount() {
    this.watch();
    if (this.logsRef) {
      this.logsRef.addEventListener('scroll', this.onScroll);
    }
    this.getServer().then(server => this.setState({ server }));
  }

  scrollToBottomIfNecessary() {
    if (this.isAtBottom && this.logsRef) {
      this.logsRef.scrollTop = this.logsRef.scrollHeight;
    }
  }

  onScroll() {
    const { scrollHeight, scrollTop, clientHeight } = this.logsRef!;
    this.isAtBottom = scrollHeight - scrollTop === clientHeight;
  }

  watch = () => {
    window.ipcRenderer.on('output', (e: Event, output: Output) => {
      const { logs } = this.state;
      const lines = formatLines(output.output).map(html => ({ html, id: uniqueId() }));
      const logInstance = [...(logs[output.id] || []), ...lines];
      this.setState({ logs: { ...logs, [output.id]: logInstance } });
      this.scrollToBottomIfNecessary();
    });
  }

  getServer = async () => {
    const serverId = this.props.match.params.server;
    const servers = await HotelApi.getServers();
    return servers.find(server => server.id === serverId);
  }

  clearLogs = () => {
    const appId = this.props.match.params.server;
    this.setState({ logs: { ...this.state.logs, [appId]: [] } });
  }

  render() {
    const appId = this.props.match.params.server;
    const logs = this.state.logs[appId] || [];
    return (
      <div className="h-100">
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top py-1">
          <div className="mr-auto font-weight-bold text-center text-white">{appId} logs</div>
          {this.state.server && <ServerRestartButton btnStyle='btn-primary' server={this.state.server} />}
          <button className="btn btn-primary" title="Clear logs" onClick={this.clearLogs}>
            <i className="fas fa-eraser"/>
          </button>
        </nav>
        <pre className="logs-window" ref={ref => this.logsRef = ref}>
          {logs.map(log => (

            <div key={log.id} dangerouslySetInnerHTML={{ __html: log.html }}/>
          ))}
        </pre>
      </div>
    );
  }
}

export default Logs;
