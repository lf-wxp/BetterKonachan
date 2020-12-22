import React from 'react';

const wrapper = (
  component: React.ReactElement,
): React.FC<{ value?: Record<string, any> }> => (): React.ReactElement => (
  <div>{component}</div>
);

export default wrapper;
