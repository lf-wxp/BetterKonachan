import { Module } from '@nestjs/common';
import { FetchModule } from './fetch/fetch.module';
import { HomeModule } from './home/home.module';

@Module({
  imports: [FetchModule, HomeModule],
})
export class AppModule {}
