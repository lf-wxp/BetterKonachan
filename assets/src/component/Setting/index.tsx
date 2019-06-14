import React, { useContext } from 'react';
import Context from '~src/context';

import { EAction } from '~cModel/action';

import './style.css';

import { TFuncVoid } from '~util';

export default React.memo(() => {
  const {
    state: { security, loading, page },
    dispatch
  } = useContext(Context);
  const handleSecurityClick: TFuncVoid = (): void => {
    dispatch({
      type: EAction.setSecurity,
      payload: !security
    });
  };

  const handleRefreshClick: TFuncVoid = (): void => {
    dispatch({
      type: EAction.setLoading,
      payload: true
    });
  };

  return (
    <section className='setting'>
      <article className={`sSecurity ${security ? 'active' : ''}`}>
        <label className='sToggle' onClick={handleSecurityClick}>
          <span className='sFake' />
        </label>
      </article>
      <article
        className={`sRefresh ${loading ? 'active' : ''}`}
        onClick={handleRefreshClick}
      >
        <div />
        <div />
        <div />
        <div />
        <div />
      </article>
    </section>
  );
});
