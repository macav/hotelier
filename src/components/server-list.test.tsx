import React from 'react';
import { fireEvent, render, screen, waitFor, act } from '../test-utils';
import utils from '../utils';
import ServerList from './server-list';

describe('ServerList', () => {
  const api = {
    startServer: jest.fn(),
    stopServer: jest.fn(),
  };

  function create() {
    return render(<ServerList />, api);
  }

  it('renders the component', () => {
    create();
    expect(
      screen
        .getAllByText('server1')[0]
        .classList.contains('server-name--stopped')
    ).toEqual(true);
    expect(
      screen
        .getAllByText('server2')[0]
        .classList.contains('server-name--running')
    ).toEqual(true);
  });

  it('can open logs', () => {
    create();
    window.ipcRenderer = {
      send: jest.fn(),
    };
    fireEvent.click(screen.getAllByTitle('Logs')[0]);
    // server2 is running, so it's the first element
    expect(window.ipcRenderer.send).toHaveBeenCalledWith('showDock', 'server2');
  });

  it('can open the server', () => {
    create();
    utils.openExternalLink = jest.fn();
    fireEvent.click(screen.getByText('server2'));
    expect(utils.openExternalLink).toHaveBeenCalledWith(
      expect.stringContaining('server2')
    );

    fireEvent.click(screen.getByText('server3'));
    expect(utils.openExternalLink).toHaveBeenCalledWith(
      expect.stringContaining('server3')
    );
    // port is in the URL
    expect(utils.openExternalLink).toHaveBeenCalledWith(
      expect.stringContaining(':3000')
    );
  });

  it('can toggle a server', async () => {
    api.stopServer.mockResolvedValue(true);
    create();
    fireEvent.click(screen.getAllByTitle('Toggle')[0]);
    expect(api.stopServer).toHaveBeenCalled();

    api.startServer.mockResolvedValue(true);
    fireEvent.click(screen.getAllByTitle('Toggle')[1]);
    expect(api.startServer).toHaveBeenCalled();

    fireEvent.click(screen.getAllByTitle('Restart')[0]);
    await waitFor(() => {
      expect(api.stopServer).toHaveBeenCalled();
      expect(api.startServer).toHaveBeenCalled();
    });
  });
});
