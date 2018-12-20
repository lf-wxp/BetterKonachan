import { IMsg } from '~model/message';

export interface IResponse<T = null> extends IMsg {
  data: T;
}
