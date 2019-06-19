import React, { Component } from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import './app.scss';
import Logs from './screens/logs';
import Main from './screens/main';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="h-100">
          <Route exact={true} path="/" component={Main} />
          <Route exact={true} path="/logs/:server" component={Logs} />
        </div>
      </Router >
    );
  }
}

export default App;
