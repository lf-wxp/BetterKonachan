import 'jest';
import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import Search from './index';
import wrapper from '../../../../test/wrapper';

const SearchTest = wrapper(<Search />);

describe('<Search />', () => {
  it('render correctly', () => {
    const { container } = render(<SearchTest />);
    expect(container).toBeTruthy();
  });

  it('fire the event', () => {
    const { container } = render(<SearchTest />);
    const input = container.querySelector('.bk-search') as HTMLInputElement;
    act(() => {
      fireEvent.input(input!, { target: { value: 'test' } });
    });

    act(() => {
      fireEvent.keyPress(input!, { key: 'Enter', keyCode: 13 });
    });

    expect(input?.value).toBe('test');
    // expect(ipcRenderer.send).toBeCalledWith(EventImage.POST, {
    //   page: 1,
    //   tags: 'test'
    // });
    // expect(ipcRenderer.send).toBeCalledTimes(1);
  });
});
