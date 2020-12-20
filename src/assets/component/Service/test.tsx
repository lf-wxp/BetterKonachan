import 'jest';
import React from 'react';
import { render, act } from '@testing-library/react';
import Service from './index';
import wrapper from '../../../../test/wrapper';

const ServiceTest = wrapper(<Service />);

describe('<Serivce />', () => {
  it('render correctly', () => {
    const { container } = render(<ServiceTest />);
    act(() => {
      // ipcRenderer.send(EventImage.DATA, {
      //   images: [],
      //   pages: 0
      // });
    });
    expect(container).toBeTruthy();
  });
});
