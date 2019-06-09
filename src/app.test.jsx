import React from 'react';
import App from './app';
import { shallow } from 'enzyme';

describe('App', () => {
  it('matches the snapshot', () => {
    const rendered = shallow(<App />);
    expect(rendered.dive()).toMatchSnapshot();
  });
});
