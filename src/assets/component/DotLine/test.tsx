import 'jest';
import React from 'react';
import { render } from '@testing-library/react';
import DotLine from './index';

jest.useFakeTimers();

describe('<DotLine />', () => {
  it('render correctly', () => {
    const { container } = render(<DotLine width={'100px'} height={'100px'} />);
    jest.runOnlyPendingTimers();
    expect(container).toBeTruthy();
  });
});
