import * as KoaWebsocket from 'koa-websocket';
import * as Router from 'koa-router';

//@ts-ignore
export interface IContext
    extends KoaWebsocket.MiddlewareContext,
        Router.IRouterContext {}
