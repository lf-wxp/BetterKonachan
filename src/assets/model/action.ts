import React from 'react';
import { Ctx } from './ctx';

export enum EAction {
  setItems = 'setItems',
  setPage = 'setPage',
  setPages = 'setPages',
  setSecurity = 'setSecurity',
  setExpand = 'setExpand',
  setDownload = 'setDownload',
  setLoading = 'setLoading',
  setDownloadStatus = 'setDownloadStatus',
  setBaseColor = 'setBaseColor',
  setTags = 'setTags',
}

export interface UpdateProgressPayload {
  url: string;
  percent: string;
  status: 'error' | 'progress' | 'success';
}
export interface Action {
  // tslint:disable-next-line: no-reserved-keywords
  type: EAction;
  payload: Ctx[keyof Ctx] | UpdateProgressPayload;
}

export type TReducer = (state: Ctx, action: Action) => Ctx;

export interface IContext {
  state: Ctx;
  dispatch: React.Dispatch<Action>;
}
