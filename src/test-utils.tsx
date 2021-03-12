import React from 'react';
import { render } from '@testing-library/react';
import { HotelContext } from './screens/hotel-context';
import HotelApi from './api';
import { Server, Status } from './interfaces';

const mockServers: Server[] = [
  { id: 'server2', status: Status.RUNNING, env: {} },
  { id: 'server1', status: Status.STOPPED, env: {} },
  { id: 'server3', status: Status.CRASHED, env: { PORT: 3000 } },
];
const HotelProviders = (api: Partial<HotelApi>, servers?: Server[]) => ({
  children,
}: {
  children: any;
}) => {
  return (
    <HotelContext.Provider
      value={{
        api: api as HotelApi,
        servers: servers || mockServers,
        updateServerStatus: jest.fn(),
      }}
    >
      {children}
    </HotelContext.Provider>
  );
};

const customRender = (ui: any, api: Partial<HotelApi>, options: any = {}) =>
  render(ui, { wrapper: HotelProviders(api, options.servers), ...options });

export * from '@testing-library/react';
export { customRender as render, mockServers };
