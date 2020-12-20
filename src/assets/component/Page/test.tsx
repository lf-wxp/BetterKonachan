/* eslint-disable @typescript-eslint/no-empty-function */
import 'jest';
import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import Page from './index';
import mousetrap from 'mousetrap';
import wrapper from '../../../../test/wrapper';

const PageTest = wrapper(<Page />);

describe('<Page />', () => {
  it('render correctly', () => {
    const { container } = render(<PageTest value={{ pages: 10, page: 3 }} />);
    expect(container).toBeTruthy();
  });

  it('error pages', () => {
    const { container } = render(<PageTest value={{ pages: 0, page: 0 }} />);
    expect(
      container.querySelector('.bk-pager')?.classList.contains('active')
    ).toBeFalsy();
  });

  it('fire prev and next event by keyborad', () => {
    const { container } = render(<PageTest value={{ pages: 10, page: 8 }} />);
    act(() => {
      mousetrap.trigger('right');
    });

    act(() => {
      mousetrap.trigger('left');
    });

    // expect(ipcRenderer.send).toBeCalledWith(EventImage.POST, {
    //   page: 9,
    //   tags: ''
    // });
    // expect(ipcRenderer.send).toBeCalledTimes(2);
    expect(container.querySelector('.current')?.textContent).toBe('8');
  });

  it('fire prev and next event by click', () => {
    const { container } = render(<PageTest value={{ pages: 10, page: 8 }} />);
    const nav = container.querySelectorAll('.bk-pager_nav');
    act(() => {
      fireEvent.click(nav[0]!);
    });
    act(() => {
      fireEvent.click(nav[1]!);
    });

    // expect(ipcRenderer.send).toBeCalledWith(EventImage.POST, {
    //   page: 7,
    //   tags: ''
    // });
    // expect(ipcRenderer.send).toBeCalledTimes(4);
    expect(container.querySelector('.current')?.textContent).toBe('8');
  });

  it('input invoke page navigator', () => {
    const { container } = render(<PageTest value={{ pages: 10, page: 8 }} />);
    const input = container.querySelector(
      '.bk-pager_go-input'
    ) as HTMLInputElement;
    const btn = container.querySelector('.bk-pager_btn');

    act(() => {
      fireEvent.change(input!, { target: { value: '9' } });
    });

    act(() => {
      fireEvent.click(btn!);
    });

    expect(input?.value).toBe('9');
    expect(container.querySelector('.current')?.textContent).toBe('9');
  });

  it('page number <= 0', () => {
    const { container } = render(<PageTest value={{ pages: 10, page: 8 }} />);
    const input = container.querySelector(
      '.bk-pager_go-input'
    ) as HTMLInputElement;
    const btn = container.querySelector('.bk-pager_btn');

    act(() => {
      fireEvent.change(input!, { target: { value: '0' } });
    });

    act(() => {
      fireEvent.click(btn!);
    });

    expect(input?.value).toBe('1');
    expect(container.querySelector('.current')?.textContent).toBe('1');
  });

  it('page number > max pages', () => {
    const { container } = render(<PageTest value={{ pages: 10, page: 8 }} />);
    const input = container.querySelector(
      '.bk-pager_go-input'
    ) as HTMLInputElement;
    const btn = container.querySelector('.bk-pager_btn');

    act(() => {
      fireEvent.change(input!, { target: { value: '11' } });
    });

    act(() => {
      fireEvent.click(btn!);
    });

    expect(input?.value).toBe('10');
    expect(container.querySelector('.current')?.textContent).toBe('10');
  });

  it('invoke page manual', () => {
    const { container, getByText } = render(
      <PageTest value={{ pages: 10, page: 1 }} />
    );
    act(() => {
      fireEvent.click(getByText('2'));
    });

    expect(container.querySelector('.current')?.textContent).toBe('2');
  });
});
