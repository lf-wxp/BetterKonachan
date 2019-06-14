import React, { useContext, useEffect } from 'react';
import { IoIosCheckmarkCircle } from 'react-icons/io';
import Progress from '~component/Progress';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Context from '~src/context';

// import { EAction } from '~cModel/action';
import { TFuncVoid } from '~util';
import { IDownload } from '~cModel/download';

import 'react-perfect-scrollbar/dist/css/styles.css';
import './style.css';

export default React.memo(() => {
  const {
    state: { download },
    // dispatch
  } = useContext(Context);

  useEffect((): TFuncVoid => {

  }, []);

  return (
    <section className='download'>
      <PerfectScrollbar>
        <div className='downloadBox'>
          {download.map((item: IDownload, key: number) => (
            <div className='downloadItem' key={key}>
              {item.percent === '100%' && (
                <span className='downloadIcon'>
                  <IoIosCheckmarkCircle />
                </span>
              )}
              <img src={item.url} alt='preview' />
              <Progress percent={item.percent} />
            </div>
          ))}
        </div>
      </PerfectScrollbar>
    </section>
  );
});
