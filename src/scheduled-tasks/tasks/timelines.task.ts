import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TimelineRepository } from '@timelines/repositories/timeline.repository';
import { TimelinesService } from '@timelines/services/timelines.service';
import { Timeline } from '@timelines/schemas/timeline.schema';
import { DEFAULT_TIMEZONE, getStartOfDayTimestamp, getTodayString, getNow } from '@common/helpers/time.helper';
import { sendTelegramMessage } from '@common/helpers/telegram.helper';

@Injectable()
export class TimelinesTask {
  private readonly logger = new Logger(TimelinesTask.name, false);

  constructor(
    private readonly timelineRepository: TimelineRepository,
    private readonly timelinesService: TimelinesService,
  ) {}

  /**
   * 방송 전체 타임라인 데이터를 조회하고 저장
   * @param date
   */
  async getTimelineDataAndSave(date: string) {
    try {
      this.logger.log(`[${getNow()}] **START** - 방송 전체 타임라인 데이터를 가져와서 저장`);

      // 해당 날짜의 시작 시간을 가져옴
      const startOfTodayTimestamp = getStartOfDayTimestamp(date);

      // 해당 날짜의 시작 시간부터 있는 전체 방송 타임라인 데이터를 조회
      const timelineData = await this.timelineRepository.getTimeline(startOfTodayTimestamp);

      // 조회한 데이터를 DB에 저장
      const createdTimeline = await this.timelinesService.create({
        date,
        broadcasts: timelineData?.list,
      });

      this.logger.log(`[${getNow()}] **END** - 방송 전체 타임라인 데이터를 가져와서 저장`);
      sendTelegramMessage(`[${getNow()}] **성공** 타임라인 저장`);

      return createdTimeline;
    } catch (error) {
      this.logger.error(`[${getNow()}]`);
      this.logger.error(error);

      sendTelegramMessage(`[${getNow()}] **실패** 타임라인 저장`);
      sendTelegramMessage(error);
    }
    return null;
  }

  /**
   * 방송 전체 타임라임과 각 방송에 대한 정보를 조회하고 저장
   * 매일 한국시간으로 (0시, 6시, 8시) 3분 00초에 실행
   */
  @Cron('0 3 0,6,8 * * *', { timeZone: DEFAULT_TIMEZONE })
  async handleCron() {
    const today: string = getTodayString();

    // 전체 타임라인 데이터를 가져와서 DB에 저장
    const createdTimeline: Timeline = await this.getTimelineDataAndSave(today);
  }
}
