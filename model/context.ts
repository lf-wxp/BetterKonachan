import KoaWebsocket from 'koa-websocket';
import Router from 'koa-router';

export interface IContext extends KoaWebsocket.MiddlewareContext, Router.IRouterContext {}
