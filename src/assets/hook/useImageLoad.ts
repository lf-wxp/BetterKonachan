import { useEffect, useRef, useState } from 'react';
import ImagePool from '../utils/imagePool';

export default <T>(imgs: T[], prop: string, limit = 4): T[] => {
  const [images, setImages] = useState([] as T[]);
  const imagePool = useRef(
    new ImagePool<T>({
      onLoad: (image: T): void => {
        setImages((prev) => [...prev, image]);
      },
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onError: (): void => {},
      limit,
    }),
  );

  useEffect(() => {
    setImages([]);
    imagePool.current.start(imgs, prop);
  }, [imgs, prop]);

  return images;
};
