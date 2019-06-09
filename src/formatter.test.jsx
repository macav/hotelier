import React from 'react';
import App from './app';
import { shallow } from 'enzyme';
import { formatLines } from './formatter';

describe('Formatter', () => {
  describe('#formatLines', () => {
    it('returns &nbsp when empty', () => {
      expect(formatLines('')).toEqual(['&nbsp;']);
    });

    it('returns input when present', () => {
      expect(formatLines('hello')).toEqual(['hello']);
    });
  });
});
