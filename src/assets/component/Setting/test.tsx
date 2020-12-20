import 'jest';
import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';
import Setting from './index';
import wrapper from '../../../../test/wrapper';

const SettingTest = wrapper(<Setting />);

describe('<Setting />', () => {
  it('render correctly', () => {
    const { container } = render(
      <SettingTest value={{ page: 1, security: true, loading: false }} />
    );
    const toggle = container.querySelector('.bk-setting__toggle');
    const refresh = container.querySelector('.bk-setting__refresh');
    act(() => {
      fireEvent.click(toggle!);
      fireEvent.click(refresh!);
    });
    expect(container).toBeTruthy();
    expect(
      container
        .querySelector('.bk-setting__security')
        ?.classList.contains('active')
    ).toBeFalsy();
    // expect(ipcRenderer.send).toBeCalledWith(EventImage.POST, {
    //   page: 1,
    //   tags: ''
    // });
    // expect(ipcRenderer.send).toBeCalledTimes(1);
  });
});
