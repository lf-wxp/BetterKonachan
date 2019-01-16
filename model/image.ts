export interface IImage {
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
}

export interface IResImage {
  height: number;
  width: number;
  file_url: string;
  sample_width: number;
  sample_height: number;
  sample_url: string;
  actual_preview_width: number;
  actual_preview_height: number;
  preview_url: string;
  rating: string;
  md5: string;
}

export interface IImageList {
  images: IImage[];
  pages: number;
}
