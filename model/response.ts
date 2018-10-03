import { IMsg } from '@model/message';

export interface IResponse<T> extends IMsg {
  data: T | null;
}
