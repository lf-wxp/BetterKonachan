import React from 'react';
import { useRecoilState } from 'recoil';
import { CubeGrid } from 'better-react-spinkit';

import { loadingState } from '../../store';

import './style.pcss';

export default React.memo(() => {
  const [loading] = useRecoilState(loadingState);

  if (!loading) {
    return null;
  }

  return (
    <section className="bk-loading">
      <CubeGrid className="sk-spinner" />
    </section>
  );
});
