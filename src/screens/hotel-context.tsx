import React from 'react';
import HotelApi from '../api';
import { Server, Status } from '../interfaces';

export const HotelContext = React.createContext<{
  api: HotelApi;
  servers: Server[];
  updateServerStatus?: (id: string, status: Status) => void;
}>({
  api: new HotelApi(),
  servers: [],
  updateServerStatus: undefined,
});
