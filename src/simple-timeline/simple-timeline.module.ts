import { Module } from '@nestjs/common';
import { SimpleTimelineService } from './simple-timeline.service';
import { SimpleTimelineController } from './simple-timeline.controller';

@Module({
  providers: [SimpleTimelineService],
  controllers: [SimpleTimelineController]
})
export class SimpleTimelineModule {}
