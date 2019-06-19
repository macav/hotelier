import { shallow } from 'enzyme';
import React from 'react';
import utils from '../utils';
import AppFooter from './app-footer';

describe('AppFooter', () => {
  function create() {
    return shallow(<AppFooter/>);
  }

  it('matches the snapshot', () => {
    const rendered = create();
    expect(rendered).toMatchSnapshot();
  });

  it('can open hotel link', () => {
    const instance = create().instance();
    jest.spyOn(utils, 'openExternalLink');
    instance.openHotel();
    expect(utils.openExternalLink).toHaveBeenCalledWith('http://localhost:2000');
  });

  it('can close the app', () => {
    jest.spyOn(window, 'close');
    create().find('#close-app').simulate('click');
    expect(window.close).toHaveBeenCalled();
  });
});
