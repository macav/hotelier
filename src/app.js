import React, { Component } from 'react';
import { HashRouter as Router, Route } from 'react-router-dom';
import Main from './screens/main';
import Logs from './screens/logs';
import './app.scss';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path='/' component={Main} />
          <Route exact path='/logs/:server' component={Logs} />
        </div>
      </Router >
    );
  }
}

export default App;
