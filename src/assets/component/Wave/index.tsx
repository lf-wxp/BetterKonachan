import React from 'react';

import './style.pcss';

interface WaveProps {
  width?: string | number;
  height: string | number;
}

export default React.memo<WaveProps>(({ width = '100%', height }) => {
  return <canvas className='bk-wave' width={width} height={height} />;
});
