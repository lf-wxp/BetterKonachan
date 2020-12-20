import React, { useCallback, useState } from 'react';
import { useRecoilState } from 'recoil';

import { tagsState } from '../../store';

import './style.pcss';

export default React.memo(() => {
  const [tags, setTags] = useRecoilState(tagsState);
  const [value, setValue] = useState('');
  const onKeyPress = useCallback(
    (e): void => {
      if (e.key === 'Enter' && value !== tags) {
        setTags(value)
      }
    },
    [value, tags],
  );
  const onInput = useCallback((e): void => {
    setValue(e.target.value);
  }, []);

  return (
    <input
      className="bk-search"
      value={value}
      onInput={onInput}
      onKeyPress={onKeyPress}
    />
  );
});
