import React from 'react';
import AppHeader from './app-header';
import renderer from 'react-test-renderer';

describe('AppHeader', () => {
  it('matches the snapshot', () => {
    const rendered = renderer.create(<AppHeader/>).toJSON();
    expect(rendered).toMatchSnapshot();
  });
});
