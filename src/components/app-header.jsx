import utils from '../utils';
import React from 'react';

export default class AppHeader extends React.Component {
  openHotel = () => {
    utils.openExternalLink('http://localhost:2000');
  }

  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="mx-auto font-weight-bold text-center text-white">Hotelier</div>
      </nav>
    );
  }
}
