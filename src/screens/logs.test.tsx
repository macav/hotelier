import { shallow } from 'enzyme';
import React from 'react';
import renderer from 'react-test-renderer';
import Logs from './logs';
import fetchMock from 'jest-fetch-mock';
import { Status } from '../interfaces';

class MockLogRef {
  scrollTop = 50;
  clientHeight = 50;

  addEventListener() {
    return jest.fn();
  }

  get scrollHeight() {
    return 100;
  }
}
describe('Logs', () => {
  let rendered: renderer.ReactTestRenderer;
  let instance: Logs;
  const match = { params: { server: 'server1' } };

  beforeEach(() => {
    fetchMock.mockResponse(
      JSON.stringify({ server1: { status: Status.RUNNING } })
    );
    rendered = renderer.create(<Logs match={match as any} />, {
      createNodeMock: (element) => {
        if (element.type === 'pre') {
          return new MockLogRef();
        }
        return null;
      },
    });
    instance = (rendered.getInstance() as any) as Logs;
  });

  it('matches the snapshot', () => {
    expect(rendered.toJSON()).toMatchSnapshot();
  });

  it('scrolls to bottom only if it is not at bottom', () => {
    instance.isAtBottom = false;
    instance.scrollToBottomIfNecessary();
    expect(instance.logsRef!.scrollTop).toEqual(50);
    instance.isAtBottom = true;
    instance.scrollToBottomIfNecessary();
    expect(instance.logsRef!.scrollTop).toEqual(100);
  });

  it('updates "isAtBottom" on scroll', () => {
    const spy = jest.spyOn(instance.logsRef!, 'scrollHeight', 'get');
    spy.mockReturnValue(10000);
    instance.onScroll();
    expect(instance.isAtBottom).toEqual(false);
    spy.mockRestore();
    instance.onScroll();
    expect(instance.isAtBottom).toEqual(true);
  });

  it('does not error when ref is not set', () => {
    instance.logsRef = null;
    expect(() => instance.onScroll()).not.toThrowError();
  });

  it('updates the state of logs', () => {
    (global as any).ipcRenderer = {
      on: (name: string, callback: any) =>
        callback(null, { id: 'server1', output: 'log output' }),
    };
    instance.watch();
    expect(instance.state.logs.server1.length).toEqual(1);
    expect(rendered.toJSON()).toMatchSnapshot('with logs');
  });

  it('clears the logs', () => {
    instance.setState({ logs: { server1: [{ id: '1', html: 'log' }] } });
    const wrapper = shallow(<Logs match={match as any} />);
    wrapper.find('button').first().simulate('click');
    expect((wrapper.instance() as Logs).state.logs.server1).toEqual([]);
  });
});
