import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FetchController } from './fetch.controller';
import { FetchService } from './fetch.service';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [FetchController],
  providers: [FetchService, ConfigService],
})
export class FetchModule {}
