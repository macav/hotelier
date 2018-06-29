import React from 'react';
import ServerItem from './server-item';
import { shallow } from 'enzyme';
import { STOPPED, RUNNING } from '../api';

describe('ServerItem', () => {
  const runningServer = { id: 'test-server-1', status: 'running' };
  const stoppedServer = { id: 'test-server-2', status: 'stopped' };

  it('matches the snapshot when the server is running', () => {
    const rendered = shallow(<ServerItem server={runningServer}/>);
    expect(rendered).toMatchSnapshot();
  });

  it('matches the snapshot when the server is stopped', () => {
    const rendered = shallow(<ServerItem server={stoppedServer}/>);
    expect(rendered).toMatchSnapshot();
  });

  describe('#actionClassName', () => {
    const instance = shallow(<ServerItem server={runningServer}/>).instance();

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
    const wrapper = shallow(<ServerItem server={runningServer} openServer={openServer}/>);
    wrapper.find('.server-name').first().simulate('click');
    expect(openServer).toHaveBeenCalled();
  });

  it('can toggle server by clicking on the action button', () => {
    const toggleServer = jest.fn();
    const wrapper = shallow(<ServerItem server={runningServer} toggleServer={toggleServer}/>);
    wrapper.find('button').last().simulate('click');
    expect(toggleServer).toHaveBeenCalled();
  });
});
