import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TimelineRepository } from '@timelines/repositories/timeline.repository';
import { TimelinesService } from '@timelines/services/timelines.service';
import { Timeline } from '@timelines/schemas/timeline.schema';
import {
  DEFAULT_TIMEZONE,
  getStartOfDayTimestamp,
  getTodayString,
  getTomorrowString,
  getNow,
} from '@common/helpers/time.helper';
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

      if (timelineData?.list?.length > 0) {
        // 조회한 데이터를 DB에 저장
        const createdTimeline = await this.timelinesService.findLatestAndOverwrite({
          date,
          broadcasts: timelineData?.list,
        });

        this.logger.log(`[${getNow()}] **END** - 방송 전체 타임라인 데이터를 가져와서 저장`);
        // sendTelegramMessage(`[${getNow()}] **성공** 타임라인 저장`);

        return createdTimeline;
      } else {
        sendTelegramMessage(`[${getNow()}] **실패** 타임라인에 방송 데이터 없음`);
      }
    } catch (error) {
      this.logger.error(`[${getNow()}]`);
      this.logger.error(error);

      sendTelegramMessage(`[${getNow()}] **실패** 타임라인 저장`);
      sendTelegramMessage(error);
    }
    return null;
  }

  /**
   * 크론 내부 로직
   * @param date
   */
  private async _handleCron(date: string) {
    // 전체 타임라인 데이터를 가져와서 DB에 저장
    return this.getTimelineDataAndSave(date);
  }

  /**
   * 방송 전체 타임라임과 각 방송에 대한 정보를 조회하고 저장
   * 매일 한국시간으로 23시 30분 10초에 실행
   */
  @Cron('10 30 23 * * *', { timeZone: DEFAULT_TIMEZONE })
  async dailyCron() {
    const tomorrow: string = getTomorrowString();
    return this._handleCron(tomorrow);
  }

  /**
   * 방송 전체 타임라임과 각 방송에 대한 정보를 조회하고 저장
   * 매일 한국시간으로 09~21시 25,55분 10초에 실행
   */
  @Cron('10 25,55 9-21 * * *', { timeZone: DEFAULT_TIMEZONE })
  async hourlyCron() {
    const today: string = getTodayString();
    return this._handleCron(today);
  }

  /**
   * 개발할 때 사용하는 테스트용 (평소에는 주석처리)
   */
  // @Cron('30 36 8 * * *', { timeZone: DEFAULT_TIMEZONE })
  // async testCron() {
  //   const today: string = getTodayString();
  //   await this._handleCron(today);
  // }
}
