import { Module, HttpModule } from '@nestjs/common';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { ConfigModule } from '../config/config.module';
import { ConfigService } from '../config/config.service';

@Module({
  imports: [HttpModule, ConfigModule],
  controllers: [HomeController],
  providers: [HomeService, ConfigService],
})
export class HomeModule {}
