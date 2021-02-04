import { Module } from '@nestjs/common';
import { TimelineService } from './services/timeline.service';
import { ScheduleModule } from '@nestjs/schedule';
import { TimelineTaskService } from '@/timeline/services/timeline-task.service';

@Module({
  imports: [ScheduleModule.forRoot()],
  providers: [TimelineService, TimelineTaskService],
})
export class TimelineModule {}
