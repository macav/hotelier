import React from 'react';
import renderer from 'react-test-renderer';
import AppHeader from './app-header';

describe('AppHeader', () => {
  it('matches the snapshot', () => {
    const rendered = renderer.create(<AppHeader/>).toJSON();
    expect(rendered).toMatchSnapshot();
  });
});
