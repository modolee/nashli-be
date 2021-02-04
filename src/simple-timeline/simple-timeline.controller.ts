import { Controller, Get, Request, Query } from '@nestjs/common';
import { SimpleTimelineService } from '@/simple-timeline/simple-timeline.service';

@Controller('simple-timeline')
export class SimpleTimelineController {
  constructor(private readonly simpleTimelineService: SimpleTimelineService) {}
  @Get()
  async getSimpleTimeline(@Request() request, @Query() query) {
    return this.simpleTimelineService.getSimpleTimeline();
  }
}
