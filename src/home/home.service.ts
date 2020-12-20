import { Injectable, HttpService } from '@nestjs/common';
import { ConfigService } from '../config/config.service';
import fs from 'fs';
import path from 'path';

@Injectable()
export class HomeService {
  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}
  async index() {
    if (this.configService.isDEV) {
      const { data } = await this.httpService
        .get('http://localhost:9999')
        .toPromise();
      return data;
    }
    return fs.readFileSync(path.relative(__dirname, '../assets/index.html'));
  }
}
