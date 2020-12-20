import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  get xmlImageUrl() {
    return 'http://konachan.net/post.xml';
  }
  get env() {
    return process.env.NODE_ENV;
  }
  get isDEV() {
    return this.env === 'development';
  }
}
