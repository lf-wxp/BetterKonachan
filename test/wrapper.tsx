import React from 'react';
import { Provider } from '../src/assets/context';

const defaultState = {
  pages: 0,
  page: 0,
  items: [],
  download: [],
  colorSet: {
    vibrant: '#39cccc',
    muted: '#0984e3',
  },
  security: true,
  loading: true,
  tags: '',
};

const wrapper = (
  component: React.ReactElement,
): React.FC<{ value?: Record<string, any> }> => ({
  value,
}: {
  value: any;
}): React.ReactElement => (
  <Provider value={{ ...defaultState, ...value }}>{component}</Provider>
);

export default wrapper;
