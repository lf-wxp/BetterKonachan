import 'jest';
import Wave from './Wave';

jest.useFakeTimers();

describe('DotLine Class', () => {
  it('instance class with colorList', () => {
    const canvas = document.createElement('canvas');
    const wave = new Wave(canvas, 3, 3, ['red', 'blue', 'pink']);
    jest.runOnlyPendingTimers();
    expect(wave).toBeTruthy();
  });

  it('instance class without colorList', () => {
    const canvas = document.createElement('canvas');
    const wave = new Wave(canvas, 3, 3);
    wave.resize(400, 200);
    jest.runOnlyPendingTimers();
    expect(wave).toBeTruthy();
  });
});
