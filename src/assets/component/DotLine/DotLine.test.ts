import 'jest';
import DotLine from './DotLine';

jest.useFakeTimers();

describe('DotLine Class', () => {
  it('instance class', () => {
    const canvas = document.createElement('canvas');
    const dotline = new DotLine(canvas, 5);
    jest.runOnlyPendingTimers();
    expect(dotline).toBeTruthy();
  });
});
