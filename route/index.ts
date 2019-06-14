import combineRouters from 'koa-combine-routers';

import { auth } from '~route/auth';
import { file } from '~route/file';
import { image } from '~route/image';
import { music } from '~route/music';
import { common } from '~route/common';
import { ws } from '~route/ws';

const router = combineRouters(auth, file, image, music, common);
export { ws, router };
