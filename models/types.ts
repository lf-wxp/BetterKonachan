import KoaWebsocket from 'koa-websocket';
import Router from 'koa-router';

export interface IAuthReqDdata {
  name?: string;
  persistent?: boolean;
  password?: string;
  url?: string;
}

export type IRequest = IAuthReqDdata;


export interface IContext extends KoaWebsocket.MiddlewareContext, Router.IRouterContext {}

