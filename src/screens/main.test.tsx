import { mockServers, render, screen } from '../test-utils';
import Main from './main';

describe('Main', () => {
  function create() {
    return render(<Main />, {});
  }

  it('lists the servers', () => {
    create();
    mockServers.forEach((server) => {
      expect(screen.getByText(server.id)).toBeDefined();
    });
  });

  it('shows the header', () => {
    create();
    expect(screen.getByText('Hotelier')).toBeDefined();
  });

  it('shows the footer', () => {
    create();
    expect(screen.getByTitle('Quit')).toBeDefined();
  });
});
