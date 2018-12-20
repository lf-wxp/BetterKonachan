import { AxiosResponse } from 'axios';
import { IResponse } from '~model/response';

export interface IServiceOpt {
  method?: string;
  url?: string;
  params?: object;
  responseType?: string;
  data?: object;
}

export function isValidRes<T>(res: AxiosResponse<IResponse<T>> | Error): res is AxiosResponse<IResponse<T>> {
  return (<AxiosResponse>res).data;
}

export type IServiceRes<Q> = AxiosResponse<Q>;

export interface IService<Q> {
  cancel(): void;
  http(data: IServiceOpt): Promise<IServiceRes<Q> | Error>;
}
