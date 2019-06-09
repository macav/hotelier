import React from 'react';
import Logs from './logs';
import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';

describe('Logs', () => {
  let rendered, instance;
  const match = { params: { server: 'server1' } };

  beforeEach(() => {
    rendered = renderer.create(<Logs match={match} />);
    instance = rendered.getInstance();
  })

  it('matches the snapshot', () => {
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('scrolls to bottom only if it is not at bottom', () => {
    global.scrollTo = jest.fn();
    instance.isAtBottom = false;
    instance.scrollToBottomIfNecessary();
    expect(global.scrollTo).not.toHaveBeenCalled();
    instance.isAtBottom = true;
    instance.scrollToBottomIfNecessary();
    expect(global.scrollTo).toHaveBeenCalled();
  });

  it('updates "isAtBottom" on scroll', () => {
    const spy = jest.spyOn(document.documentElement, 'scrollHeight', 'get');
    spy.mockReturnValue(10000);
    instance.onScroll();
    expect(instance.isAtBottom).toEqual(false);
    spy.mockRestore();
    instance.onScroll();
    expect(instance.isAtBottom).toEqual(true);
  });

  it('updates the state of logs', () => {
    global.ipcRenderer = { on: (name, callback) => callback(null, { id: 'server1', output: 'log output' }) };
    instance.watch();
    expect(instance.state.logs['server1'].length).toEqual(1);
    expect(rendered.toJSON()).toMatchSnapshot('with logs');
  });

  it('clears the logs', () => {
    instance.setState({ logs: { server1: [{ id: 1, output: 'log' }] } });
    const wrapper = shallow(<Logs match={match} />);
    wrapper.find('button').first().simulate('click');
    expect(wrapper.instance().state.logs.server1).toEqual([]);
  });
});
