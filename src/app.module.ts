import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { resolve } from 'path';
import { FetchModule } from './fetch/fetch.module';
import { HomeModule } from './home/home.module';

@Module({
  imports: [
    FetchModule,
    HomeModule,
    ServeStaticModule.forRoot({
      rootPath: resolve(__dirname, 'assets'),
      serveRoot: '/assets',
      exclude: ['/api*'],
    }),
  ],
})
export class AppModule {}
