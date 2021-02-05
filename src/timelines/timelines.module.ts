import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from '@database/database.module';
import { Timeline, TimelineSchema } from '@timelines/schemas/timeline.schema';
import { TimelinesService } from '@timelines/services/timelines.service';
import { TimelineRepository } from '@timelines/repositories/timeline.repository';

@Module({
  imports: [DatabaseModule, MongooseModule.forFeature([{ name: Timeline.name, schema: TimelineSchema }])],
  providers: [TimelinesService, TimelineRepository],
  exports: [TimelinesService, TimelineRepository],
})
export class TimelinesModule {}
