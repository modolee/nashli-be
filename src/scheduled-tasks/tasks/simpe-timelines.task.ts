import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DEFAULT_TIMEZONE, getTodayString, getNow } from '@common/helpers/time.helper';
import { Timeline } from '@timelines/schemas/timeline.schema';
import { TimelinesService } from '@timelines/services/timelines.service';
import { Broadcast } from '@broadcasts/schemas/broadcast.schema';
import { BroadcastsService } from '@broadcasts/services/broadcasts.service';
import { SimpleTimeline } from '@simple-timelines/schemas/simple-timeline.schema';
import { SimpleTimelinesService } from '@simple-timelines/services/simple-timelines.service';
import { sendTelegramMessage } from '@common/helpers/telegram.helper';

@Injectable()
export class SimpleTimelinesTask {
  private readonly logger = new Logger(SimpleTimelinesTask.name, false);

  constructor(
    private readonly timelinesService: TimelinesService,
    private readonly broadcastsService: BroadcastsService,
    private readonly simpleTimelinesService: SimpleTimelinesService,
  ) {}

  /**
   * 시간만 추출
   * @param time
   */
  getShortTime(time: string) {
    return time.split('T')[1].substr(0, 5);
  }

  /**
   * 네이버페이 보상 여부
   * @param contentsHtml
   */
  getRewardType(contentsHtml: string) {
    const REWARD_NO = '네이버 페이포인트 지급되지 않';
    const REWARD_YES = '네이버 페이 포인트가 라이브 참여 선물로 함께 지급';
    const REWARD_MAYBE = '부적합한 시청 행위 및 타인에게 불쾌감을 주는 메시지';

    if (contentsHtml.indexOf(REWARD_NO) !== -1) {
      return 'RewardNo';
    } else if (contentsHtml.indexOf(REWARD_YES) !== -1) {
      return 'RewardYes';
    } else if (contentsHtml.indexOf(REWARD_MAYBE) !== -1) {
      return 'RewardMaybe';
    } else {
      return 'RewardNotSure';
    }
  }

  /**
   * 타임라인을 단순화하여 저장
   * @param timeline
   * @param broadcast
   */
  async simplifyTimlinesAndSave(timeline: Timeline, broadcast: Broadcast) {
    try {
      this.logger.log(`[${getNow()}] **START** - 단순화 시킨 타임라인 저장`);

      const simpleBroadcasts = {};

      // 타임라인 전체를 돌면서 방송ID, 방송제목, 시작시간, URL을 추출
      // 세부 방송 정보에서는 네이버페이 지급 여부를 확인
      timeline.broadcasts.map(({ broadcastId, broadcastTitle, expectedStartDate, bridgeEndUrl, broadcastEndUrl }) => {
        const time = this.getShortTime(expectedStartDate);
        const contentsHtml = broadcast.broadcastsDetail[`${broadcastId}`].contentsHtml;
        const reward = this.getRewardType(contentsHtml);

        const simpleBroadcast = {
          id: broadcastId,
          title: broadcastTitle,
          broadcastUrl: broadcastEndUrl,
          bridgeUrl: bridgeEndUrl,
          reward,
        };

        if (!simpleBroadcasts[time]) {
          simpleBroadcasts[time] = [simpleBroadcast];
        } else {
          simpleBroadcasts[time] = [simpleBroadcast, ...simpleBroadcasts[time]];
        }
      });

      // 단순화 시킨 데이터를 DB에 저장
      const createdSimpleTimeline = await this.simpleTimelinesService.create({
        date: timeline.date,
        simpleBroadcasts,
      });

      this.logger.log(`[${getNow()}] **END** - 단순화 시킨 타임라인 저장`);
      sendTelegramMessage(`[${getNow()}] **성공** 단순화 시킨 타임라인 저장`);

      return createdSimpleTimeline;
    } catch (error) {
      this.logger.error(`[${getNow()}]`);
      this.logger.error(error);

      sendTelegramMessage(`[${getNow()}] **실패** 단순화 시킨 타임라인 저장`);
      sendTelegramMessage(error);
    }

    return null;
  }

  /**
   * 방송 전체 타임라임과 각 방송에 대한 정보를 조회하고 저장
   * 매일 한국시간 00:03:00 에 실행
   */
  @Cron('0 3 0 * * *', { timeZone: DEFAULT_TIMEZONE })
  async handleCron() {
    const today: string = getTodayString();

    // 전체 타임라인 데이터를 조회
    const savedTimeline: Timeline = await this.timelinesService.findLatest(today);

    // 개별 방송 데이터를 조회
    const savedBroadcast: Broadcast = await this.broadcastsService.findLatest(today);

    // 정상적으로 저장 한 경우에만 실행
    if (savedTimeline && savedBroadcast) {
      // 개별 방송에 대한 정보를 가져와서 DB에 저장
      const createdSimpleTimeline: SimpleTimeline = await this.simplifyTimlinesAndSave(savedTimeline, savedBroadcast);

      if (createdSimpleTimeline) {
        sendTelegramMessage(JSON.stringify(createdSimpleTimeline));
      }
    }
  }
}
