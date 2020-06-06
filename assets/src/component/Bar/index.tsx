import React from 'react';

import { TFuncVoid } from '~util';

import './style.css';

export default React.memo(() => {
  const close: TFuncVoid = (): void => {
  };
  const max: TFuncVoid = (): void => {
  };
  const min: TFuncVoid = (): void => {
  };

  return (
    <section className='bar'>
      <span className='barClose' onClick={close} role='button' />
      <span className='barExpand' onClick={max} role='button'>
        <span />
      </span>
      <span className='barMini' onClick={min} role='button' />
    </section>
  );
});
