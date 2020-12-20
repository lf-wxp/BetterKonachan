export interface ImageDetail {
  id: number;
  sampleWidth: number;
  sampleHeight: number;
  sample: string;
  previewWidth: number;
  previewHeight: number;
  preview: string;
  url: string;
  width: number;
  height: number;
  security: boolean;
  name: string;
  tags: string;
}

export interface ImageList {
  images: ImageDetail[];
  pages: number;
  page?: number;
}

export interface IImageList {
  images: ImageDetail[];
  total: number;
}
