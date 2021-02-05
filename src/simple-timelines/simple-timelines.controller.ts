import { Controller, Get, Request, Query } from '@nestjs/common';
import { SimpleTimelinesService } from '@simple-timelines/simple-timelines.service';

@Controller('simple-timeline')
export class SimpleTimelinesController {
  constructor(private readonly simpleTimelineService: SimpleTimelinesService) {}
  @Get()
  async getSimpleTimeline(@Request() request, @Query() query) {
    return this.simpleTimelineService.getSimpleTimeline();
  }
}
