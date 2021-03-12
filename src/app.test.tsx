import { shallow } from 'enzyme';
import React from 'react';
import App from './app';
import { fireEvent, render, screen } from './test-utils';
import mockFetch from 'jest-fetch-mock';

describe('App', () => {
  const servers = { server1: { status: 'running', env: {} } };
  const servers2 = {
    server1: { status: 'running', env: {} },
    server2: { status: 'running', env: {} },
  };

  beforeEach(() => jest.useFakeTimers());

  afterEach(() => jest.useRealTimers());

  it('renders list that is updated periodically', async () => {
    mockFetch.mockResponseOnce(JSON.stringify(servers));
    render(<App />, {});
    expect(screen.getByText('Hotel')).toBeDefined();
    const server1 = await screen.findByText('server1');
    expect(server1).toBeDefined();

    mockFetch.mockResponseOnce(JSON.stringify(servers2));
    jest.runTimersToTime(3000);
    const server2 = await screen.findByText('server2');
    expect(server2).toBeDefined();
  });

  it('updates servers based on ipcRenderer', async () => {
    let ipcRendererCallback: Function = () => {};
    (global as any).ipcRenderer = {
      on: (name: string, callback: any) =>
        (ipcRendererCallback = (data: any) => callback(null, data)),
    };
    mockFetch.mockResponseOnce(JSON.stringify(servers));
    render(<App />, {});

    ipcRendererCallback(servers2);
    const server2 = await screen.findByText('server2');
    expect(server2).toBeDefined();
  });

  it('updates server status', async () => {
    mockFetch.mockResponseOnce(JSON.stringify(servers));
    render(<App />, {});

    let server1 = await screen.findByText('server1');
    expect(server1.classList.contains('server-name--running')).toEqual(true);

    mockFetch.mockResponseOnce(
      JSON.stringify({ ...servers, server1: { status: 'stopped', env: {} } })
    );
    fireEvent.click(screen.getByTitle('Toggle'));
    server1 = await screen.findByText('server1');
    expect(server1.classList.contains('server-name--stopped')).toEqual(true);
  });
});
