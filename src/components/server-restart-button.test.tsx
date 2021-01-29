import { shallow } from 'enzyme';
import React from 'react';
import hotelApi from '../api';
import { Server, Status } from '../interfaces';
import utils from '../utils';
import ServerList from './server-list';
import ServerRestartButton from './server-restart-button';

describe('ServerRestartButton', () => {
  const server: Server = {
    id: 'test-server-1',
    status: Status.RUNNING,
    env: {},
  };
  let updateServerStatusFn: any;
  let loadServersFn: any;

  beforeEach(() => {
    updateServerStatusFn = jest.fn();
    loadServersFn = jest.fn();
  });

  function create(btnStyle?: string) {
    return shallow(<ServerRestartButton btnStyle={btnStyle} server={server} />);
  }

  it('matches the snapshot', () => {
    const rendered = create();
    expect(rendered).toMatchSnapshot();
  });

  it('matches snapshot with provided btnStyle', () => {
    const rendered = create('btn-primary');
    expect(rendered).toMatchSnapshot();
  });

  describe('#restartServer', () => {
    let instance: ServerRestartButton;

    beforeEach(() => {
      instance = create().instance() as ServerRestartButton;
      instance['api'].startServer = jest.fn().mockResolvedValue(true);
      instance['api'].stopServer = jest.fn().mockResolvedValue(true);
      jest.useFakeTimers();
      instance.restartServer();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('calls the api', () => {
      expect(instance['api'].startServer).toHaveBeenCalledWith('test-server-1');
      expect(instance['api'].stopServer).toHaveBeenCalledWith('test-server-1');
    });

    it('updates the state', () => {
      expect(instance.state.server.status).toEqual(Status.RESTARTING);
      jest.runTimersToTime(1000);
      expect(instance.state.server.status).toEqual(Status.RUNNING);
    });
  });
});
