import {
  allPass,
  cond,
  curry,
  divide,
  is,
  isNil,
  match,
  multiply,
  not,
  nth,
  pipe,
  SafePred,
  test,
  flip,
  T,
} from 'ramda';
import React, { useEffect, useRef, useState } from 'react';
import { useMeasure } from 'react-use';
import { useRecoilState } from 'recoil';

import DotLine from './DotLine';
import { colorSetState } from '../../store';

import './style.pcss';

interface DotLineProps {
  width?: string | number;
  height?: string | number;
}

const judge = (fn: SafePred<any>, idx: number): ((x: any) => boolean) =>
  pipe(nth(idx), fn);

const int = curry(Number.parseInt);

const percent2number = pipe(
  match(/(\d+)/),
  nth(0),
  flip(int)(10),
  flip(divide)(100),
  multiply,
);

const parseWidthPercent = ([percent, width]: [unknown, number]): number =>
  percent2number(percent as string)(width);

const getSize = cond<[unknown, number], number>([
  [judge(is(Number), 0), nth(0) as (...a: any) => number],
  [
    allPass([
      judge(is(String), 0),
      judge(test(/^\d+%$/), 0),
      judge(pipe(isNil, not), 1),
    ]),
    parseWidthPercent,
  ],
]);

export default React.memo<DotLineProps>(
  ({ width = '100%', height = '100%' }) => {
    const canvas = useRef((null as unknown) as HTMLCanvasElement);
    const [realH, setRealH] = useState<number>(0);
    const [realW, setRealW] = useState(0);
    const bgObj = useRef((null as unknown) as DotLine);
    const [
      ref,
      { width: parentW, height: parentH },
    ] = useMeasure<HTMLDivElement>();
    const [{ mute, vibrant }] = useRecoilState(colorSetState);

    useEffect(() => {
      bgObj.current = new DotLine(canvas.current, 5);
    }, []);

    useEffect(() => {
      setRealH(getSize([height, parentH]));
    }, [height, parentH]);

    useEffect(() => {
      setRealW(getSize([width, parentW]));
    }, [width, parentW]);

    useEffect(() => {
      if (bgObj.current) {
        bgObj.current.resize(realW, realH);
      }
    }, [realW, realH]);

    useEffect(() => {
      if (bgObj.current) {
        bgObj.current.setColor({ dotColor: vibrant, lineColor: mute });
      }
    }, [vibrant, mute]);

    return (
      <div ref={ref} className="bk-canvas">
        <canvas
          className="bk-dotline"
          ref={canvas}
          width={realW}
          height={realH}
        />
      </div>
    );
  },
);
