import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { formatLines } from '../formatter';
import uniqueId from 'lodash/uniqueId';

class Logs extends Component {
  static propTypes = {
    match: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = { logs: {} };
    this.onScroll = this.onScroll.bind(this);
    this.isAtBottom = true;
  }

  componentDidMount() {
    this.watch();
    window.addEventListener('scroll', this.onScroll);
  }

  scrollToBottomIfNecessary() {
    if (this.isAtBottom) {
      window.scrollTo(0, document.documentElement.scrollHeight);
    }
  }

  onScroll() {
    this.isAtBottom = document.documentElement.scrollHeight === document.documentElement.scrollTop + document.documentElement.clientHeight;
  }

  watch = () => {
    window.ipcRenderer.on('output', (_e, output) => {
      const { logs } = this.state;
      const lines = formatLines(output.output).map(html => ({ html, id: uniqueId() }));
      const logInstance = [...(logs[output.id] || []), ...lines];
      this.setState({ logs: { ...logs, [output.id]: logInstance } });
      this.scrollToBottomIfNecessary();
    });
  }

  clearLogs = () => {
    const appId = this.props.match.params.server;
    this.setState({ logs: { ...this.state.logs, [appId]: [] } });
  }

  render() {
    const appId = this.props.match.params.server;
    const logs = this.state.logs[appId] || [];
    return (
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top py-1">
          <div className="mr-auto font-weight-bold text-center text-white">{appId} logs</div>
          <button className="btn btn-primary" title="Clear logs" onClick={this.clearLogs}>
            <i className="fas fa-eraser"></i>
          </button>
        </nav>
        <pre>
          {logs.map(log => (
            <div key={log.id} dangerouslySetInnerHTML={{ __html: log.html }}></div>
          ))}
        </pre>
      </div>
    );
  }
};

export default Logs;
