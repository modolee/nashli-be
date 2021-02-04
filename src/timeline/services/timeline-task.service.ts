import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TimelineTaskService {
  private readonly logger = new Logger(TimelineTaskService.name);

  @Cron('1 * * * * *')
  handleCron() {
    this.logger.debug('Called per min');
  }
}
