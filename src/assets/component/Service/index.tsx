import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import axios from 'axios';

import {
  imagesState,
  totalState,
  loadingState,
  tagsState,
  pageState,
  refreshToggleState,
} from '../../store';

export default React.memo(() => {
  const [, setImages] = useRecoilState(imagesState);
  const [, setTotal] = useRecoilState(totalState);
  const [, setLoading] = useRecoilState(loadingState);
  const [tags] = useRecoilState(tagsState);
  const [page] = useRecoilState(pageState);
  const [refresh] = useRecoilState(refreshToggleState);

  useEffect(() => {
    setLoading(true);
    axios
      .request({
        url: '/api/post',
        method: 'GET',
        params: {
          tags,
          page,
          refresh,
        },
      })
      .then(({ data }) => {
        setImages(data.images);
        setTotal(data.total);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [refresh, tags, page]);

  return null;
});
