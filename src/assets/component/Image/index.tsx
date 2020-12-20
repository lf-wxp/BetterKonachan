import React, { useState } from 'react';

import { TFunc1Void, TFuncVoid } from '../../utils/type';

import './style.pcss';

interface ImageProps {
  src: string;
  fallback?: string;
  className?: string;
  style?: React.CSSProperties;
  height?: number;
  width?: number;
}

enum EImageState {
  loaded = 'loaded',
  pending = 'pending',
  error = 'error',
}

export default ({
  src,
  fallback,
  className,
  style,
  width,
  height,
}: ImageProps): React.ReactElement => {
  const [state, setState] = useState(EImageState.pending);
  const [animationEnd, setAnimationEnd] = useState(false);
  const [isError, setIsError] = useState(false);
  const onLoad: TFunc1Void<React.FormEvent<HTMLImageElement>> = (): void => {
    if (!isError) {
      setState(EImageState.loaded);
    }
  };

  const onError: TFunc1Void<React.FormEvent<HTMLImageElement>> = (
    e: React.FormEvent<HTMLImageElement>,
  ): void => {
    const target: HTMLImageElement = e.currentTarget;
    setState(EImageState.error);
    setIsError(true);
    if (fallback) {
      target.src = fallback;
    }
  };

  const onAnimationEnd: TFuncVoid = (): void => {
    setAnimationEnd(true);
  };

  return (
    <div
      className={`bk-image ${animationEnd ? 'animationend' : ''}`}
      style={{ width: (width as number) - 10, height: (height as number) - 10 }}
    >
      <img
        alt="image"
        src={src}
        style={style}
        className={`${className} ${state}`}
        onAnimationEnd={onAnimationEnd}
        onError={onError}
        onLoad={onLoad}
      />
    </div>
  );
};
