import { retry, mergeMap } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';

const imagePromise = (url: string): Promise<string> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = (): void => {
      resolve(url);
    };
    img.onerror = (err): void => {
      reject(err);
    };
    img.src = url;
  });

class ImagePool<T extends Record<string, any>> {
  private images: T[] = [];
  private urls: string[] = [];
  private limit: number;
  private pool: Map<string, unknown>;
  private prop = '';
  private onLoad: (image: T) => void;
  private onError: (err: Event | string) => void;

  constructor({
    onLoad,
    onError,
    limit,
  }: {
    onLoad: (image: T) => void;
    onError: (err: Event | string) => void;
    limit: number;
  }) {
    this.onLoad = onLoad;
    this.onError = onError;
    this.limit = limit;
    this.pool = new Map();
  }

  start(images: T[], prop: string): void {
    this.urls = images.map((imgs) => imgs[prop] as string);
    this.images = images;
    this.prop = prop;
    this.pool.clear();
    while (this.urls.length > 0 && this.pool.size < this.limit) {
      this.addImage();
    }
  }

  createImage(url: string): Subscription {
    return of(url)
      .pipe(
        mergeMap((url) => imagePromise(url)),
        retry(2),
      )
      .subscribe(
        (url) => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this.onLoad(this.images.find((image) => image[this.prop] === url)!);
        },
        (err) => {
          this.onError(err);
        },
        () => {
          this.cleanResolved(url);
          this.addImage();
        },
      );
  }

  addImage(): void {
    if (this.urls.length <= 0 || this.pool.size >= this.limit) {
      return;
    }
    const url = this.urls.pop();
    if (url) {
      this.pool.set(url as string, this.createImage(url as string));
    }
  }

  cleanResolved(url: string): void {
    this.pool.delete(url);
  }
}

export default ImagePool;
