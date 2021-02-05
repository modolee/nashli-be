import { Module } from '@nestjs/common';
import { SimpleTimelinesService } from './simple-timelines.service';
import { SimpleTimelinesController } from './simple-timelines.controller';

@Module({
  providers: [SimpleTimelinesService],
  controllers: [SimpleTimelinesController],
})
export class SimpleTimelinesModule {}
