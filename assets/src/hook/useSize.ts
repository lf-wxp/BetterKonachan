import { useEffect, useRef, useState } from 'react';
import ResizeObserver from 'resize-observer-polyfill';

interface ISize {
  width: number;
  height: number;
}

const useSize: (dom: HTMLElement | null, ms?: number) => ISize = (
  dom: HTMLElement | null,
  ms: number = 500
): ISize => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const handler: React.MutableRefObject<number> = useRef(0);
  const observer: React.MutableRefObject<ResizeObserver> = useRef(
    new ResizeObserver(
      (entries: ResizeObserverEntry[]): void => {
        const entry: ResizeObserverEntry = entries && entries[0];
        const { width, height } = entry.contentRect;
        if (handler.current) {
          window.clearTimeout(handler.current);
        }
        handler.current = window.setTimeout(() => {
          setSize({
            width,
            height
          });
        }, ms);
      }
    )
  );
  useEffect(() => {
    if (dom) {
      observer.current.observe(dom);

      return (): void => {
        observer.current.unobserve(dom);
      };
    }
  }, [dom]);

  return size;
};

export default useSize;
