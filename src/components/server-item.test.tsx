import { shallow } from 'enzyme';
import React from 'react';
import { Server, Status } from '../interfaces';
import Utils from '../utils';
import ServerItem from './server-item';

describe('ServerItem', () => {
  let runningServer: Server;
  let stoppedServer: Server;
  let instance: ServerItem;

  beforeEach(() => {
    runningServer = { id: 'test-server-1', status: Status.RUNNING, env: {} };
    stoppedServer = { id: 'test-server-2', status: Status.STOPPED, env: {} };
    Utils.openExternalLink = jest.fn();
  });

  function renderComponent({
    restartServer,
    server,
    openServer,
    toggleServer,
    openLogs,
  }: {
    restartServer?: any;
    server?: Server;
    openServer?: any;
    toggleServer?: any;
    openLogs?: any;
  } = {}) {
    const rendered = shallow(
      <ServerItem
        server={server || runningServer}
        openServer={openServer || jest.fn()}
        toggleServer={toggleServer || jest.fn()}
        restartServer={restartServer || jest.fn()}
        openLogs={openLogs || jest.fn()}
      />
    );
    instance = rendered.instance() as ServerItem;
    return rendered;
  }

  describe('#componentDidUpdate', () => {
    it('does not update the state if server is restarting', () => {
      const restartServer = jest.fn();
      const rendered = renderComponent({ restartServer });
      runningServer.status = Status.RESTARTING;
      const newServerState = { ...runningServer };
      newServerState.status = Status.STOPPED;
      rendered.setProps({ server: newServerState });
      expect(instance.state.server.status).toEqual(Status.RESTARTING);
    });

    it('updates the state from new props if server is not restarting', () => {
      const rendered = renderComponent();
      const newServerState = { ...runningServer };
      newServerState.status = Status.STOPPED;
      rendered.setProps({ server: newServerState });
      expect(instance.state.server.status).toEqual(Status.STOPPED);
    });
  });

  it('matches the snapshot when the server is running', () => {
    const rendered = renderComponent({ server: runningServer });
    expect(rendered).toMatchSnapshot();
  });

  it('matches the snapshot when the server is stopped', () => {
    const rendered = renderComponent({ server: stoppedServer });
    expect(rendered).toMatchSnapshot();
  });

  describe('#actionClassName', () => {
    beforeEach(() => renderComponent({ server: runningServer }));

    it('is light when status is STOPPED', () => {
      expect(instance.actionClassName(Status.STOPPED)).toEqual('btn-light');
    });

    it('is danger when status is RUNNING', () => {
      expect(instance.actionClassName(Status.RUNNING)).toEqual(
        'btn-danger text-white'
      );
    });

    it('is light when status is unknown', () => {
      expect(instance.actionClassName('bla')).toEqual('btn-light');
    });
  });

  it('can open server by clicking on the name', () => {
    const openServer = jest.fn();
    const wrapper = renderComponent({ openServer });
    wrapper.find('.server-name').first().simulate('click');
    expect(openServer).toHaveBeenCalled();
  });

  it('can toggle server by clicking on the action button', () => {
    const toggleServer = jest.fn();
    const wrapper = renderComponent({ toggleServer });
    wrapper.find('button').at(0).simulate('click');
    expect(toggleServer).toHaveBeenCalled();
  });

  it('can open logs of server by clicking on the logs button', () => {
    const openLogs = jest.fn();
    const wrapper = renderComponent({ openLogs });
    wrapper.find('button').at(1).simulate('click');
    expect(openLogs).toHaveBeenCalled();
  });
});
