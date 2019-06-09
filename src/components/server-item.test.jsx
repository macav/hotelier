import React from 'react';
import ServerItem from './server-item';
import { shallow } from 'enzyme';
import { STOPPED, RUNNING, RESTARTING } from '../api';
import Utils from '../utils';

describe('ServerItem', () => {
  let runningServer;
  let stoppedServer;

  beforeEach(() => {
    runningServer = { id: 'test-server-1', status: RUNNING };
    stoppedServer = { id: 'test-server-2', status: STOPPED };
    Utils.openExternalLink = jest.fn();
  });

  describe('#componentDidUpdate', () => {
    it('does not update the state if server is restarting', () => {
      const restartServer = jest.fn();
      const rendered = shallow(<ServerItem server={runningServer} restartServer={restartServer} openLogs={jest.fn()} />);
      rendered.instance().restartServer(runningServer);
      const newServerState = Object.assign({}, runningServer);
      newServerState.status = STOPPED;
      rendered.setProps({ server: newServerState });
      expect(rendered.instance().state.server.status).toEqual(RESTARTING);
    });

    it('updates the state from new props if server is not restarting', () => {
      const rendered = shallow(<ServerItem server={runningServer} />);
      const newServerState = Object.assign({}, runningServer);
      newServerState.status = STOPPED;
      rendered.setProps({ server: newServerState });
      expect(rendered.instance().state.server.status).toEqual(STOPPED);
    });
  });

  it('matches the snapshot when the server is running', () => {
    const rendered = shallow(<ServerItem server={runningServer} />);
    expect(rendered).toMatchSnapshot();
  });

  it('matches the snapshot when the server is stopped', () => {
    const rendered = shallow(<ServerItem server={stoppedServer} />);
    expect(rendered).toMatchSnapshot();
  });

  describe('#actionClassName', () => {
    let instance;

    beforeEach(() => instance = shallow(<ServerItem server={runningServer} />).instance());

    it('is light when status is STOPPED', () => {
      expect(instance.actionClassName(STOPPED)).toEqual('btn-light');
    });

    it('is danger when status is RUNNING', () => {
      expect(instance.actionClassName(RUNNING)).toEqual('btn-danger text-white');
    });

    it('is light when status is unknown', () => {
      expect(instance.actionClassName('bla')).toEqual('btn-light');
    });
  });

  it('can open server by clicking on the name', () => {
    const openServer = jest.fn();
    const wrapper = shallow(<ServerItem server={runningServer} openServer={openServer} />);
    wrapper.find('.server-name').first().simulate('click');
    expect(openServer).toHaveBeenCalled();
  });

  it('can toggle server by clicking on the action button', () => {
    const toggleServer = jest.fn();
    const wrapper = shallow(<ServerItem server={runningServer} toggleServer={toggleServer} openLogs={jest.fn()} />);
    wrapper.find('button').at(1).simulate('click');
    expect(toggleServer).toHaveBeenCalled();
  });

  it('can open logs of server by clicking on the logs button', () => {
    const openLogs = jest.fn();
    const wrapper = shallow(<ServerItem server={runningServer} toggleServer={jest.fn()} openLogs={openLogs} />);
    wrapper.find('button').at(2).simulate('click');
    expect(openLogs).toHaveBeenCalled();
  });

  describe('restart button', () => {
    it('can restart server by clicking on the restart button', () => {
      jest.useFakeTimers();
      const restartServer = jest.fn();
      const wrapper = shallow(<ServerItem server={runningServer} restartServer={restartServer} openLogs={jest.fn()} />);
      wrapper.find('.restart-button').first().simulate('click');
      expect(restartServer).toHaveBeenCalled();
      expect(runningServer.status).toEqual(RESTARTING);
      expect(wrapper.instance().state.server.status).toEqual(RESTARTING);
      jest.runOnlyPendingTimers();
      expect(runningServer.status).toEqual(RUNNING);
      expect(wrapper.instance().state.server.status).toEqual(RUNNING);
    });
  });
});
