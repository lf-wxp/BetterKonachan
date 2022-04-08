import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '../config/config.service';
import { lastValueFrom } from 'rxjs';
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
      // const { data } = await this.httpService.get('http://localhost:9999')
      // return data;
      const { data } = await lastValueFrom(this.httpService.get('http://localhost:9999'));
      return data;
    }
    return fs
      .readFileSync(path.resolve(__dirname, '../assets/index.html'))
      .toString('utf-8');
  }
}
