import * as combineRouters from 'koa-combine-routers';

import auth from '@route/auth';
import file from '@route/file';
import image from '@route/image';
import music from '@route/music';

export default combineRouters(auth, file, image, music);
