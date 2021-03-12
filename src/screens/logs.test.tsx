import { shallow } from 'enzyme';
import React from 'react';
import Logs from './logs';
import fetchMock from 'jest-fetch-mock';
import { Status } from '../interfaces';
import {
  act,
  fireEvent,
  getByText,
  getByTitle,
  render,
  screen
} from '../test-utils';

class MockLogRef {
  scrollTop = 50;
  clientHeight = 50;

  addEventListener() {
    return jest.fn();
  }

  get scrollHeight() {
    return 100;
  }
}

describe('Logs', () => {
  const matchForRunningServer = { params: { server: 'server2' } };
  const matchForStoppedServer = { params: { server: 'server1' } };

  it('displays the header', () => {
    render(<Logs match={matchForRunningServer as any} />, {});

    expect(screen.getByTitle('Clear logs')).toBeDefined();
    expect(screen.getByTitle('Restart')).toBeDefined();
  });

  it('displays has no restart button when server is stopped', () => {
    render(<Logs match={matchForStoppedServer as any} />, {});

    expect(screen.queryAllByTitle('Restart').length).toEqual(0);
  });

  const mockLog = (output = 'log output') => {
    (global as any).ipcRenderer = {
      on: (name: string, callback: any) =>
        callback(null, { id: 'server2', output }),
    };
  };

  const mockLogsContainer = (container: HTMLElement) => {
    Object.defineProperty(container, 'clientHeight', {
      writable: true,
      value: 100,
    });
    Object.defineProperty(container, 'scrollHeight', {
      writable: true,
      value: 200,
    });
    Object.defineProperty(container, 'scrollTop', {
      writable: true,
      value: 100,
    });
  };

  const renderWithLogs = () => {
    mockLog();
    const renderObj = render(<Logs match={matchForRunningServer as any} />, {});
    renderObj.rerender(<Logs match={matchForRunningServer as any} />);
    return renderObj;
  };

  it('updates the state of logs', () => {
    mockLog();
    const { rerender } = render(
      <Logs match={matchForRunningServer as any} />,
      {}
    );
    expect(screen.queryAllByTitle('log output').length).toEqual(0);

    rerender(<Logs match={matchForRunningServer as any} />);
    expect(screen.getByText('log output')).toBeDefined();
  });

  it('can clear the logs', () => {
    renderWithLogs();
    fireEvent.click(screen.getByTitle('Clear logs'));
    expect(screen.queryByTitle('log output')).toBeNull();
  });

  it('sets isAtBottom', async () => {
    let logWriter: Function = () => {};
    (global as any).ipcRenderer = {
      on: (name: string, callback: any) =>
        (logWriter = (output: string) =>
          callback(null, { id: 'server2', output })),
    };
    const { rerender } = render(
      <Logs match={matchForRunningServer as any} />,
      {}
    );

    await act(async () => {
      for (let i = 0; i < 1000; i++) {
        logWriter(`output ${i}`);
      }
      rerender(<Logs match={matchForRunningServer as any} />);

      const logsContainer = await screen.findByTestId('logs-window');
      mockLogsContainer(logsContainer);

      expect(logsContainer.scrollTop).toEqual(
        logsContainer.scrollHeight - logsContainer.clientHeight
      );
      fireEvent.scroll(logsContainer, { target: { scrollTop: 0 } }); // scroll to top
      logWriter('output last');
      expect(logsContainer.scrollTop).toEqual(0);
    });
  });
});
