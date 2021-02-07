import { Module } from '@nestjs/common';
import { TimelinesTask } from '@scheduled-tasks/tasks/timelines.task';
import { BroadcastsTask } from '@scheduled-tasks/tasks/broadcasts.task';
import { SimpleTimelinesTask } from '@scheduled-tasks/tasks/simple-timelines.task';
import { TimelinesModule } from '@timelines/timelines.module';
import { BroadcastRepository } from '@broadcasts/repositories/broadcast.repository';
import { ScheduleModule } from '@nestjs/schedule';
import { BroadcastsModule } from '@broadcasts/broadcasts.module';
import { SimpleTimelinesModule } from '@simple-timelines/simple-timelines.module';

@Module({
  imports: [ScheduleModule.forRoot(), TimelinesModule, BroadcastsModule, SimpleTimelinesModule],
  providers: [BroadcastRepository, TimelinesTask, BroadcastsTask, SimpleTimelinesTask],
})
export class ScheduledTasksModule {}
