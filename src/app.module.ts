import { Module } from '@nestjs/common';
import { TimelinesModule } from '@timelines/timelines.module';
import { BroadcastsModule } from '@broadcasts/broadcasts.module';
import { SimpleTimelinesModule } from '@simple-timelines/simple-timelines.module';
import { ScheduledTasksModule } from '@scheduled-tasks/scheduled-tasks.module';

@Module({
  imports: [TimelinesModule, BroadcastsModule, SimpleTimelinesModule, ScheduledTasksModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
