import React from 'react';
import { AppFooter, AppHeader, ServerList } from '../components';

interface Props {}
const Main: React.FC<Props> = () => {
  return (
    <div className="main-container">
      <div className="header-arrow" />
      <div className="window">
        <AppHeader />
        <div className="window-content">
          <div className="pane">
            <ServerList />
          </div>
        </div>
        <AppFooter />
      </div>
    </div>
  );
};

export default Main;
