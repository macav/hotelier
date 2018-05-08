import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';
import renderer from 'react-test-renderer';

import mockFetch from 'jest-fetch-mock';

describe('App', () => {
  beforeEach(() => {
    mockFetch.mockResponse('[]');
  });

  it('matches the snapshot', () => {
    const tree = renderer.create(<App/>).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
