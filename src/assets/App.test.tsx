import 'jest';
import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

describe.only('<App />', () => {
  it('render correctly', () => {
    const { container } = render(<App />);
    expect(container).toBeTruthy();
    expect(container.querySelector('.bk-aside')).toBeTruthy();
    expect(container.querySelector('.bk-section')).toBeTruthy();
  });
});
