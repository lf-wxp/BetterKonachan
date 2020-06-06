import React, {
  useEffect,
  useContext,
  useRef,
  useState,
  CSSProperties
} from 'react';
import Context from '~src/context';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Image from '~component/Image';
import fallbackImage from '~image/loaderror.png';
import { FaDownload } from 'react-icons/fa';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import useSize from '~hook/useSize';

import { IImageDom } from '~cModel/imageDom';
import { EAction } from '~cModel/action';
import { IImage } from '~model/image';
import { IDownload } from '~cModel/download';
import { TFunc1Void, TFunc1, TFunc2, TFunc3, TFuncVoidReturn } from '~util';

import 'react-perfect-scrollbar/dist/css/styles.css';
import './style.css';

let columnArray: number[] = [0];
const maxWidth = 300;
const minWidth = 200;

const shortestColumn: TFuncVoidReturn<{ height: number; index: number }> = (): {
  height: number;
  index: number;
} => {
  const min: number = Math.min(...columnArray);
  const index: number = columnArray.indexOf(min);

  return {
    height: min,
    index
  };
};

const calcColumnWidth: TFunc1<number, { column: number; colWidth: number }> = (
  width: number
): { column: number; colWidth: number } => {
  if (width) {
    const w: number = width;
    const l: number = w % maxWidth;
    let column: number;
    let colWidth: number;
    if (l) {
      column = Math.ceil(w / maxWidth);
      colWidth = w / column;
    } else {
      column = w / maxWidth;
      colWidth = maxWidth;
    }
    if (colWidth < minWidth) {
      column = 1;
      colWidth = w;
    }

    return {
      column,
      colWidth
    };
  } else {
    return {
      column: 0,
      colWidth: 0
    };
  }
};

const calcColumnArray: TFunc1Void<number> = (h: number): void => {
  const { index, height } = shortestColumn();
  columnArray.splice(index, 1, height + h);
};

const calcPosition: TFunc1<number, { x: number; y: number }> = (
  w: number
): { x: number; y: number } => {
  const { height, index } = shortestColumn();
  const offsetX: number = index * w;
  const offsetY: number = height;

  return {
    x: offsetX,
    y: offsetY
  };
};

const calcList: TFunc2<IImage[], number, IImageDom[]> = (
  items: IImage[],
  width: number
): IImageDom[] => {
  return items.map((item: IImage, i: number) => {
    const newItem: IImageDom = { ...item };
    const h: number = (item.height / item.width) * width;
    newItem.styleW = width;
    newItem.styleH = h;
    const { x, y } = calcPosition(width);
    calcColumnArray(h);
    newItem.style = {
      width: `${width}px`,
      height: `${h}px`,
      transform: `translateX(${x}px) translateY(${y}px)`
    };

    return newItem;
  });
};

const updateLayout: TFunc3<IImage[], number, boolean, IImageDom[]> = (
  items: IImage[],
  width: number,
  security: boolean
): IImageDom[] => {
  const { column, colWidth } = calcColumnWidth(width);
  // tslint:disable-next-line: prefer-array-literal
  columnArray = new Array(column).fill(0);
  const filterItem: IImage[] = items.filter((item: IImage) =>
    security ? item.security : true
  );

  return calcList(filterItem, colWidth);
};

export default React.memo(() => {
  const {
    state: { items, download, security },
    dispatch
  } = useContext(Context);
  const refDom: React.MutableRefObject<null> = useRef(null);
  const [list, setList] = useState([] as IImageDom[]);
  const { width } = useSize(refDom.current);

  const handleDownload: TFunc1Void<React.FormEvent<HTMLAnchorElement>> = (
    e: React.FormEvent<HTMLAnchorElement>
  ): void => {
    e.preventDefault();
    const target: HTMLElement = e.currentTarget;
    const { index } = target.dataset;
    const filterItem: IImage[] = items.filter((it: IImage) =>
      security ? it.security : true
    );
    const item: IImage = filterItem[Number.parseInt(index as string, 10)];
    const previewUrl: string = item.preview;
    const data: IDownload = {
      url: previewUrl,
      percent: '0%'
    };
    if (!download.find(({ url }: { url: string }) => url === data.url)) {
      dispatch({
        type: EAction.setDownload,
        payload: [...download, data]
      });
    }
  };

  useEffect((): void => {
    setList(updateLayout(items, width, security));
  }, [width, items, security]);

  const combineStyle: TFunc2<CSSProperties, number, CSSProperties> = (
    style: CSSProperties,
    key: number
  ): CSSProperties => {
    return {
      ...style,
      transitionDelay: `${key * 0.02}s`
    };
  };

  return (
    <PerfectScrollbar>
      <div ref={refDom} className='listWrap'>
        <TransitionGroup>
          {list.map((item: IImageDom, key: number) => (
            <CSSTransition key={item.name} timeout={5000} classNames='flip'>
              <figure
                key={item.name}
                style={combineStyle(item.style as CSSProperties, key)}
                className='listItem'
              >
                <Image
                  fallback={fallbackImage}
                  className='listImg'
                  width={item.styleW}
                  height={item.styleH}
                  style={{ animationDelay: `${key * 0.1}s` }}
                  src={item.preview}
                />
                <div className='listTool'>
                  <p className='listInfo'>
                    {item.width} / {item.height}
                  </p>
                  <a
                    href={item.url}
                    className='listDown'
                    target='_blank'
                    data-index={key}
                    rel='noreferrer'
                    onClick={handleDownload}
                  >
                    <FaDownload />
                  </a>
                </div>
              </figure>
            </CSSTransition>
          ))}
        </TransitionGroup>
      </div>
    </PerfectScrollbar>
  );
});
