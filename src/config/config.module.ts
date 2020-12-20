import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';

@Module({
  imports: [],
  providers: [ConfigService],
})
export class ConfigModule {}
