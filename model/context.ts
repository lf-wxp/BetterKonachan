import * as KoaWebsocket from 'koa-websocket';
import * as Router from 'koa-router';

// @ts-ignore: 类型错误
export interface IContext extends KoaWebsocket.MiddlewareContext, Router.IRouterContext {}
