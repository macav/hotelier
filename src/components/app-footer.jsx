import React from 'react';
import utils from '../utils';

export default class AppFooter extends React.Component {
  openHotel = () => {
    utils.openExternalLink('http://localhost:2000');
  }

  render() {
    const { reload } = this.props;
    return (
      <footer className="toolbar toolbar-footer">
        <div className="toolbar-actions pull-left">
          <button className="btn btn-default" onClick={this.openHotel}>Hotel</button>
        </div>
        <div className="toolbar-actions pull-right">
          <div className="btn-group">
            <button className="btn btn-default" onClick={reload}>
              <span className="icon icon-arrows-ccw" title="Refresh"></span>
            </button>
            <button className="btn btn-default" onClick={() => window.close()}>
              <span className="icon icon-cancel" title="Quit"></span>
            </button>
          </div>
        </div>
      </footer>
    );
  }
}
