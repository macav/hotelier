export enum Status {
  RUNNING = 'running',
  RESTARTING = 'restarting',
  STOPPED = 'stopped',
  CRASHED = 'crashed',
}
export interface Server {
  id: string;
  status: Status;
  env: { [key: string]: any };
}
