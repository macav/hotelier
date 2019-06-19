import React from 'react';
import utils from '../utils';

export default class AppFooter extends React.Component {
  openHotel = () => {
    utils.openExternalLink('http://localhost:2000');
  }

  render() {
    return (
      <footer className="fixed-bottom bg-primary">
        <div className="float-left">
          <button className="btn btn-primary" onClick={this.openHotel}>Hotel</button>
        </div>
        <div className="float-right">
          <div className="btn-group">
            <button className="btn btn-primary" id="close-app" onClick={() => window.close()}>
              <span className="fas fa-power-off" title="Quit"/>
            </button>
          </div>
        </div>
      </footer>
    );
  }
}
