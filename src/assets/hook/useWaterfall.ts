import { useEffect, useState } from 'react';
import {
  flip,
  gt,
  ifElse,
  mathMod,
  divide,
  when,
  pipe,
  lt,
  prop,
  update,
  add,
  multiply,
  reduce,
  filter,
  mergeLeft,
} from 'ramda';

import { TFunc1 } from '../utils/type';
import { ImageDetail } from '../model/image';
import { ImageDom } from '../model/imageDom';

interface UseWaterfallProps {
  security: boolean;
  width: number;
  images: ImageDetail[];
  maxWidth: number;
  minWidth: number;
}

const shortestColumnPure: TFunc1<
  number[],
  { height: number; index: number; colArray: number[] }
> = (colArray: number[]) => {
  const min: number = Math.min(...colArray);
  const index: number = colArray.indexOf(min);

  return {
    height: min,
    index,
    colArray,
  };
};

const calcColumnWidth = (mW: number) => (
  mM: number,
): TFunc1<number, { column: number; colWidth: number; width: number }> =>
  pipe(
    ifElse(
      flip(gt)(0),
      pipe(
        ifElse(
          pipe(flip(mathMod)(mW), flip(gt)(0)),
          (w) => ({
            column: Math.ceil(w / mW),
            colWidth: divide(w, Math.ceil(w / mW)),
            width: w,
          }),
          (w) => ({
            column: Math.ceil(w / mW),
            colWidth: mW,
            width: w,
          }),
        ),
        when(pipe(prop('colWidth'), flip(lt)(mM)), (p) => ({
          column: 1,
          colWidth: prop('width', p),
          width: prop('width', p),
        })),
      ),
      (w) => ({
        column: 0,
        colWidth: 0,
        width: w,
      }),
    ),
  );

const calcColumnArrayPure = (h: number): TFunc1<number[], number[]> =>
  pipe(shortestColumnPure, (p) =>
    update(prop('index')(p), add(prop('height')(p), h), prop('colArray')(p)),
  );

const calcPositionPure = (
  colWidth: number,
): TFunc1<number[], { x: number; y: number }> =>
  pipe(shortestColumnPure, (o) => ({
    x: multiply(prop('index', o), colWidth),
    y: prop('height', o),
  }));

const calcListItemSize = (
  item: ImageDetail,
  colWidth: number,
  cols: number[],
): ImageDom => {
  const ratio = (divide(
    prop('height')(item),
    prop('width')(item),
  ) as unknown) as number;
  const height = multiply(colWidth)(ratio);
  const { x, y } = calcPositionPure(colWidth)(cols);
  return mergeLeft({
    styleW: colWidth,
    styleH: height,
    style: {
      width: colWidth,
      height,
      transform: `translateX(${x}px) translateY(${y}px)`,
    },
  })(item);
};

const updateLayoutPure = (security: boolean) => (colWidth: number) => (
  colArray: number[],
): TFunc1<ImageDetail[], { cols: number[]; items: ImageDom[] }> =>
  pipe(
    filter<ImageDetail>((item) => (security ? item.security : true)),
    reduce(
      ({ cols, items }, item) => {
        const newItem = calcListItemSize(item, colWidth, cols);
        const newCols = calcColumnArrayPure(prop('styleH', newItem) as number)(
          cols,
        );
        items.push(newItem);
        return {
          cols: newCols,
          items: [...items],
        };
      },
      { cols: colArray, items: [] as ImageDom[] },
    ),
  );

export default ({
  security,
  width,
  images,
  maxWidth,
  minWidth,
}: UseWaterfallProps): ImageDom[] => {
  const [list, setList] = useState<ImageDom[]>([]);
  useEffect(() => {
    const { column, colWidth } = calcColumnWidth(maxWidth)(minWidth)(width);
    const colArray = new Array(column).fill(0);
    const layout = updateLayoutPure(security)(colWidth)(colArray)(images);
    setList(layout.items);
  }, [images, maxWidth, minWidth, security, width]);

  return list;
};
