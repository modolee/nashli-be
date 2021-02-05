import { Module } from '@nestjs/common';
import { SimpleTimelinesService } from './services/simple-timelines.service';
import { SimpleTimelinesController } from './simple-timelines.controller';
import { DatabaseModule } from '@database/database.module';
import { MongooseModule } from '@nestjs/mongoose';
import { SimpleTimeline, SimpleTimelineSchema } from '@simple-timelines/schemas/simple-timeline.schema';

@Module({
  imports: [DatabaseModule, MongooseModule.forFeature([{ name: SimpleTimeline.name, schema: SimpleTimelineSchema }])],
  controllers: [SimpleTimelinesController],
  providers: [SimpleTimelinesService],
  exports: [SimpleTimelinesService],
})
export class SimpleTimelinesModule {}
