import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TimelineRepository } from '@timelines/repositories/timeline.repository';
import { TimelinesService } from '@timelines/services/timelines.service';
import { DEFAULT_TIMEZONE, getStartOfDayTimestamp, getToday, getNow } from '@common/helpers/time.helper';
import { Timeline } from '@timelines/schemas/timeline.schema';
import { BroadcastRepository } from '@broadcasts/repositories/broadcast.repository';
import { Broadcast } from '@broadcasts/schemas/broadcast.schema';
import { BroadcastsService } from '@broadcasts/services/broadcasts.service';

@Injectable()
export class TimelineAndBroadcastTask {
  private readonly logger = new Logger(TimelineAndBroadcastTask.name, false);

  constructor(
    private readonly broadcastRepository: BroadcastRepository,
    private readonly timelineRepository: TimelineRepository,
    private readonly broadcastsService: BroadcastsService,
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

      return createdTimeline;
    } catch (error) {
      this.logger.error(`[${getNow()}]`);
      this.logger.error(error);
    }
    return null;
  }

  /**
   * 개별 방송 데이터를 조회하고 저장
   * @param timeline
   */
  async getBroadcastsDataAndSave(timeline: Timeline) {
    try {
      this.logger.log(`[${getNow()}] **START** - 개별 방송 데이터를 가져와서 저장`);

      const broadcastsData = await Promise.all(
        timeline.broadcasts.map(({ broadcastId }) => {
          return this.broadcastRepository.getBroadcast(broadcastId);
        }),
      );

      const broadcastsDetail = broadcastsData.map(broadcast => Object.entries(broadcast).map(([id, data]) => data)[0]);

      // 조회한 데이터를 DB에 저장
      const createdBroadcast = await this.broadcastsService.create({
        date: timeline.date,
        broadcastsDetail,
      });

      this.logger.log(`[${getNow()}] **END** - 개별 방송 데이터를 가져와서 저장`);

      return createdBroadcast;
    } catch (error) {
      this.logger.error(`[${getNow()}]`);
      this.logger.error(error);
    }

    return null;
  }

  /**
   * 방송 전체 타임라임과 각 방송에 대한 정보를 조회하고 저장
   * 매일 한국시간 0:0:10 에 실행
   */
  @Cron('10 52 0 * * *', { timeZone: DEFAULT_TIMEZONE })
  async handleCron() {
    const today: string = getToday();

    // 전체 타임라인 데이터를 가져와서 DB에 저장
    const createdTimeline: Timeline = await this.getTimelineDataAndSave(today);

    // 정상적으로 저장 한 경우에만 실행
    if (createdTimeline) {
      // 개별 방송에 대한 정보를 가져와서 DB에 저장
      const createdBroadcasts: Broadcast = await this.getBroadcastsDataAndSave(createdTimeline);

      // 정상적으로 저장한 경우에만 실행
      if (createdBroadcasts) {
      }
    }
  }
}
