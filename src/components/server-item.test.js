import React from 'react';
import ServerItem from './server-item';
import { shallow } from 'enzyme';
import { STOPPED, RUNNING, RESTARTING } from '../api';

describe('ServerItem', () => {
  let runningServer;
  let stoppedServer;

  beforeEach(() => {
    runningServer = { id: 'test-server-1', status: RUNNING };
    stoppedServer = { id: 'test-server-2', status: STOPPED };
  });

  describe('#componentDidUpdate', () => {
    it('does not update the state if server is restarting', () => {
      const restartServer = jest.fn();
      const rendered = shallow(<ServerItem server={runningServer} restartServer={restartServer} />);
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

    it('is positive when status is STOPPED', () => {
      expect(instance.actionClassName(STOPPED)).toEqual('tcon-transform btn-default');
    });

    it('is negative when status is RUNNING', () => {
      expect(instance.actionClassName(RUNNING)).toEqual('btn-negative text-white');
    });

    it('is neutral when status is unknown', () => {
      expect(instance.actionClassName('bla')).toEqual('tcon-transform btn-default');
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
    const wrapper = shallow(<ServerItem server={runningServer} toggleServer={toggleServer} />);
    wrapper.find('button').last().simulate('click');
    expect(toggleServer).toHaveBeenCalled();
  });

  describe('restart button', () => {
    it('can restart server by clicking on the restart button', () => {
      jest.useFakeTimers();
      const restartServer = jest.fn();
      const wrapper = shallow(<ServerItem server={runningServer} restartServer={restartServer} />);
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
