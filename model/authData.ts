import { IUser } from '~model/user';
import { IResponse } from '~model/response';

export type IAuthRes = IResponse<IUser>;

export interface IAuthReqData {
  name: string;
  persistent: boolean;
  password: string;
  url: string;
}
