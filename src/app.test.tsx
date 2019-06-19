import { shallow } from 'enzyme';
import React from 'react';
import App from './app';

describe('App', () => {
  it('matches the snapshot', () => {
    const rendered = shallow(<App />);
    expect(rendered.dive()).toMatchSnapshot();
  });
});
