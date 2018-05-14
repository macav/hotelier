import { configure } from 'enzyme';

import mockFetch from 'jest-fetch-mock';

import Adapter from 'enzyme-adapter-react-16';
configure({ adapter: new Adapter() });

global.fetch = mockFetch;
