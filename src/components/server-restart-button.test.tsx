import React from 'react';
import { fireEvent, render, screen, waitFor, act, mockServers } from '../test-utils';
import ServerRestartButton from './server-restart-button';

describe('ServerRestartButton', () => {
  const api = {
    startServer: jest.fn(),
    stopServer: jest.fn(),
  };

  function create(serverId = 'server2') {
    return render(<ServerRestartButton server={mockServers[0]} />, api);
  }

  it('renders the component', () => {
    create();
    expect(
      screen.getByRole('button').getElementsByClassName('fas fa-redo')
    ).toHaveLength(1);
  });

  it('restarts the server when clicking on the button', async () => {
    jest.useFakeTimers();
    const { rerender } = create();
    fireEvent.click(screen.getByRole('button'));
    await waitFor(() => expect(api.stopServer).toHaveBeenCalled());
    await waitFor(() => expect(api.startServer).toHaveBeenCalled());
    rerender(<ServerRestartButton server={mockServers[0]} />);
    let icon = await screen.findByTestId('restart-icon');
    expect(icon.classList.contains('spin')).toEqual(true);
    await act(async () => {
      jest.runTimersToTime(1000);
      rerender(<ServerRestartButton server={mockServers[0]} />);
      icon = await screen.findByTestId('restart-icon');
      expect(icon.classList.contains('spin')).toEqual(false);
    });
    jest.useRealTimers();
  });
});
