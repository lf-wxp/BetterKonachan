import { atom } from 'recoil';

import { ImageDetail } from './model/image';

export const pagesState = atom({
  key: 'pagesState',
  default: 0,
});

export const pageState = atom({
  key: 'pageState',
  default: 1,
});

export const securityState = atom({
  key: 'securityState',
  default: true,
});

export const loadingState = atom({
  key: 'loadingState',
  default: true,
});

export const tagsState = atom({
  key: 'tagsState',
  default: '',
});

export const refreshToggleState = atom({
  key: 'refreshToggleState',
  default: false,
});

export const imagesState = atom<ImageDetail[]>({
  key: 'imagesState',
  default: [],
});

export const totalState = atom({
  key: 'totalState',
  default: 0,
});

export const colorSetState = atom({
  key: 'colorSetState',
  default: {
    mute: '#39cccc',
    vibrant: '#39ccc',
  },
});
