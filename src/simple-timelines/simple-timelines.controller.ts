import { Controller, Get, Request, Query } from '@nestjs/common';
import { SimpleTimelinesService } from '@simple-timelines/services/simple-timelines.service';

@Controller('schedule')
export class SimpleTimelinesController {
  constructor(private readonly simpleTimelineService: SimpleTimelinesService) {}
  @Get()
  async getSimpleTimeline(@Request() request, @Query() query) {
    const date = query.date;
    return this.simpleTimelineService.findLatest(date);
  }
}
