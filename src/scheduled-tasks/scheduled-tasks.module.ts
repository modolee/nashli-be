import { Module } from '@nestjs/common';
import { TimelineAndBroadcastTask } from '@scheduled-tasks/tasks/timeline-and-broadcast.task';
import { TimelinesModule } from '@timelines/timelines.module';
import { BroadcastRepository } from '@broadcasts/repositories/broadcast.repository';
import { ScheduleModule } from '@nestjs/schedule';
import { BroadcastsModule } from '@broadcasts/broadcasts.module';

@Module({
  imports: [ScheduleModule.forRoot(), TimelinesModule, BroadcastsModule],
  providers: [TimelineAndBroadcastTask, BroadcastRepository],
})
export class ScheduledTasksModule {}
