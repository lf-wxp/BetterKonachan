import React, { useContext } from 'react';
import Context from '~src/context';

import './style.css';

export default React.memo(() => {
  const {
    state: { bgUri }
  } = useContext(Context);

  return (
    <figure className='bg'>
      <img src={bgUri} className='bgImage' alt='bg' />
    </figure>
  );
});
