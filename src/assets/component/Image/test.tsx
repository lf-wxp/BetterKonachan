import 'jest';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Image from './index';
import mockImage from '../../../../test/mock/file';

describe('<Image />', () => {
  it('render correctly', () => {
    const { container } = render(
      <Image src={mockImage} width={100} height={100} />
    );
    expect(container).toBeTruthy();
  });

  it('error imag with fallback image', () => {
    const { container } = render(
      <Image src={''} fallback={mockImage} width={100} height={100} />
    );
    const img = container.querySelector('img');
    fireEvent.error(img!);
    fireEvent.animationEnd(img!);
    // expect(img?.getAttribute('src')).toBe(mockImage);
    expect(
      container.querySelector('.bk-image')?.classList.contains('animationend')
    ).toBeTruthy();
  });
});
