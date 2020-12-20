import React from 'react';
import { useRecoilState } from 'recoil';

import { TFuncVoid } from '../../utils/type';
import { securityState, refreshToggleState, loadingState } from '../../store';

import './style.pcss';

export default React.memo(() => {
  const [security, setSecurity] = useRecoilState(securityState);
  const [, setRefresh] = useRecoilState(refreshToggleState);
  const [loading] = useRecoilState(loadingState);
  const handleSecurityClick: TFuncVoid = (): void => {
    setSecurity((s) => !s);
  };

  const handleRefreshClick: TFuncVoid = (): void => {
    setRefresh((s) => !s);
  };

  return (
    <section className="bk-setting">
      <article className={`bk-setting__security ${security ? 'active' : ''}`}>
        <label className="bk-setting__toggle" onClick={handleSecurityClick}>
          <span className="bk-setting__fake" />
        </label>
      </article>
      <article
        className={`bk-setting__refresh ${loading ? 'active' : ''}`}
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
