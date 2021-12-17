import { Controller, Get, Query, Res } from '@nestjs/common';
import { FetchService } from './fetch.service';
import { Response } from 'express';

@Controller('api/')
export class FetchController {
  constructor(private readonly fetchService: FetchService) {}

  @Get('post')
  getImages(
    @Query('page') page: string,
    @Query('tags') tags: string,
    @Query('isSafe') isSafe: boolean,
  ) {
    return this.fetchService.getImages(page, tags, isSafe);
  }

  @Get('image')
  async getImage(@Query('url') url: string, @Res() res: Response) {
    const { data, headers } = await this.fetchService.getImage(url);
    res.set(headers);
    data.pipe(res);
  }
}
