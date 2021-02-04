import { Module } from '@nestjs/common';
import { TimelineModule } from './timeline/timeline.module';
import { BroadcastModule } from './broadcast/broadcast.module';
import { SimpleTimelineModule } from './simple-timeline/simple-timeline.module';

@Module({
  imports: [TimelineModule, BroadcastModule, SimpleTimelineModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
