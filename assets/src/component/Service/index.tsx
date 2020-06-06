import React, { useContext, useEffect } from 'react';
import Context from '~src/context';

import { EAction } from '~cModel/action';
// import { IImageList } from '~model/image';

export default React.memo(() => {
  const { dispatch } = useContext(Context);

  useEffect((): (() => void) => {
    dispatch({
      type: EAction.setPage,
      payload: 1
    });

    return (): void => {};
  }, []);

  return null;
});
