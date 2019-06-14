import React from 'react';

import './style.css';

export default React.memo(({ percent }: { percent: string }) => {
  return (
    <span className='progress'>
      <span style={{ width: percent }} />
    </span>
  );
});
