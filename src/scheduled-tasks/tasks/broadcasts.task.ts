import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { TimelinesService } from '@timelines/services/timelines.service';
import { DEFAULT_TIMEZONE, getTodayString, getNow } from '@common/helpers/time.helper';
import { Timeline } from '@timelines/schemas/timeline.schema';
import { BroadcastRepository } from '@broadcasts/repositories/broadcast.repository';
import { Broadcast } from '@broadcasts/schemas/broadcast.schema';
import { BroadcastsService } from '@broadcasts/services/broadcasts.service';
import { sendTelegramMessage } from '@common/helpers/telegram.helper';

@Injectable()
export class BroadcastsTask {
  private readonly logger = new Logger(BroadcastsTask.name, false);

  constructor(
    private readonly broadcastRepository: BroadcastRepository,
    private readonly broadcastsService: BroadcastsService,
    private readonly timelinesService: TimelinesService,
  ) {}

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

      const broadcastsDetail = {};
      broadcastsData.map(broadcast =>
        Object.entries(broadcast).map(([id, data]) => {
          broadcastsDetail[id] = data;
        }),
      );

      // 조회한 데이터를 DB에 저장
      const createdBroadcast = await this.broadcastsService.create({
        date: timeline.date,
        broadcastsDetail,
      });

      this.logger.log(`[${getNow()}] **END** - 개별 방송 데이터를 가져와서 저장`);
      sendTelegramMessage(`[${getNow()}] **성공** 상세 방송 정보 저장`);

      return createdBroadcast;
    } catch (error) {
      this.logger.error(`[${getNow()}]`);
      this.logger.error(error);

      sendTelegramMessage(`[${getNow()}] **실패** 상세 방송 정보 저장`);
      sendTelegramMessage(error);
    }

    return null;
  }

  /**
   * 방송 전체 타임라임과 각 방송에 대한 정보를 조회하고 저장
   * 매일 한국시간 00:02:00 에 실행
   */
  @Cron('0 2 0 * * *', { timeZone: DEFAULT_TIMEZONE })
  async handleCron() {
    const today: string = getTodayString();

    // 전체 타임라인 데이터를 조회
    const savedTimeline: Timeline = await this.timelinesService.findLatest(today);

    // 정상적으로 저장 한 경우에만 실행
    if (savedTimeline) {
      // 개별 방송에 대한 정보를 가져와서 DB에 저장
      const createdBroadcasts: Broadcast = await this.getBroadcastsDataAndSave(savedTimeline);
    }
  }
}