import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DEFAULT_TIMEZONE, getTodayString, getTomorrowString, getNow } from '@common/helpers/time.helper';
import { Timeline } from '@timelines/schemas/timeline.schema';
import { TimelinesService } from '@timelines/services/timelines.service';
import { Broadcast } from '@broadcasts/schemas/broadcast.schema';
import { BroadcastsService } from '@broadcasts/services/broadcasts.service';
import { SimpleTimelinesService } from '@simple-timelines/services/simple-timelines.service';
import { sendTelegramMessage } from '@common/helpers/telegram.helper';
import he from 'he';

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
   * HTML 제거
   * @param contents
   */
  removeHtmlTag(contents: string) {
    // HTML Tag 제거
    return he.decode(contents.replace(/<[^>]*>?/gm, ''));
  }

  /**
   * 추가 정보 조회
   * @param contentsHtml
   */
  getAdditionalInfo(contentsHtml: string): string[] {
    const ADDITIONAL_INFO = [`'안녕하세요' 외 2회 이상 채팅 참여`];

    // HTML Tag 제거
    let contentsWithoutHtml = this.removeHtmlTag(contentsHtml);

    // 추가 정보 저장 변수
    const additionalInfoResult: string[] = [];

    // 댓글 2번 이상 기록해야 되는지 여부
    ADDITIONAL_INFO.map(message => {
      if (contentsWithoutHtml.indexOf(message) !== -1) {
        additionalInfoResult.push(message);
      }
    });

    return additionalInfoResult;
  }

  /**
   * 네이버페이 보상 여부
   * @param contentsHtml
   */
  getRewardType(contentsHtml: string) {
    const REWARD_NO = [
      '네이버 페이포인트 지급이 없',
      '네이버 페이포인트 지급되지 않',
      '본 라이브 방송은 시청 보상 네이버 페이 포인트가 지급되지 않습니다.',
      '본 라이브는 시청 보상 페이 포인트가 지급되지 않습니다.',
    ];
    const REWARD_YES = [
      '네이버 페이 포인트가 라이브 참여 선물로 함께 지급',
      '라이브 시청만 해도 네이버페이포인트를 드려요',
    ];
    const REWARD_PROBABLY = [
      '네이버 페이 포인트가 지급되지 않을 수',
      '채팅 메시지 1회 이상 작성',
      '네이버 페이 이용 약관 동의가 필요',
    ];
    const REWARD_MAYBE = [
      '부적합한 시청 행위 및 타인에게 불쾌감을 주는 메시지',
      '부적합한 시청행위 및 타인에게 불쾌감을 주는 메시지',
      '부적합한 시청 행위',
    ];

    // HTML Tag 제거
    let contentsWithoutHtml = this.removeHtmlTag(contentsHtml);

    // 결과를 저장하는 변수 선언
    let noResult,
      yesResult,
      probablyResult,
      maybeResult = false;

    // 페이 지급 없음
    REWARD_NO.map(message => {
      noResult = noResult || contentsWithoutHtml.indexOf(message) !== -1;
    });

    // 페이 지급 확정
    REWARD_YES.map(message => {
      yesResult = yesResult || contentsWithoutHtml.indexOf(message) !== -1;
    });

    // 페이 지급 가능성 높음
    REWARD_PROBABLY.map(message => {
      probablyResult = probablyResult || contentsWithoutHtml.indexOf(message) !== -1;
    });

    // 페이 지급 가능성 낮음
    REWARD_MAYBE.map(message => {
      maybeResult = maybeResult || contentsWithoutHtml.indexOf(message) !== -1;
    });

    // 페이 지급 가능성 판단
    if (noResult) {
      return 'RewardNo';
    } else if (yesResult) {
      return 'RewardYes';
    } else if (probablyResult) {
      return 'RewardProbably';
    } else if (maybeResult) {
      return 'RewardMaybe';
    } else {
      return 'RewardNotSure';
    }
  }

  /**
   * 타임라인을 단순화하여 저장
   * @param timeline
   * @param savedBroadcast
   */
  async simplifyTimlinesAndSave(timeline: Timeline, savedBroadcast: Broadcast) {
    try {
      this.logger.log(`[${getNow()}] **START** - 단순화 시킨 타임라인 저장`);

      const simpleBroadcasts = {};

      // 타임라인 전체를 돌면서 방송ID, 방송제목, 시작시간, URL을 추출
      // 세부 방송 정보에서는 네이버페이 지급 여부를 확인
      timeline.broadcasts.map(({ broadcast, broadcastBridge }) => {
        if (broadcast && broadcastBridge) {
          const { id: broadcastId, title: broadcastTitle, expectedStartDate, broadcastEndUrl } = broadcast;
          const { bridgeEndUrl } = broadcastBridge;
          // 세부 방송 정보가 있는 경우에만 단순화 한 타임라인에 추가
          if (savedBroadcast.broadcastsDetail[`${broadcastId}`]) {
            const time = this.getShortTime(expectedStartDate);
            const contentsHtml = savedBroadcast.broadcastsDetail[`${broadcastId}`].contentsHtml;
            const reward = this.getRewardType(contentsHtml);
            const additionalInfo = this.getAdditionalInfo(contentsHtml);

            const simpleBroadcast = {
              id: broadcastId,
              title: broadcastTitle,
              broadcastUrl: broadcastEndUrl,
              bridgeUrl: bridgeEndUrl,
              reward,
              additionalInfo,
            };

            if (!simpleBroadcasts[time]) {
              simpleBroadcasts[time] = [simpleBroadcast];
            } else {
              simpleBroadcasts[time] = [simpleBroadcast, ...simpleBroadcasts[time]];
            }
          }
        }
      });

      // 단순화 시킨 데이터를 DB에 저장
      const createdSimpleTimeline = await this.simpleTimelinesService.findLatestAndOverwrite({
        date: timeline.date,
        simpleBroadcasts,
      });

      this.logger.log(`[${getNow()}] **END** - 단순화 시킨 타임라인 저장`);
      // sendTelegramMessage(`[${getNow()}] **성공** 단순화 시킨 타임라인 저장`);

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
   * 크론 내부 로직
   * @param date
   */
  private async _handleCron(date) {
    // 전체 타임라인 데이터를 조회
    const savedTimeline: Timeline = await this.timelinesService.findLatest(date);

    // 개별 방송 데이터를 조회
    const savedBroadcast: Broadcast = await this.broadcastsService.findLatest(date);

    // 정상적으로 저장 한 경우에만 실행
    if (
      savedTimeline?.broadcasts?.length > 0 &&
      savedBroadcast?.broadcastsDetail &&
      Object.keys(savedBroadcast?.broadcastsDetail).length > 0
    ) {
      // 개별 방송에 대한 정보를 가져와서 DB에 저장
      return this.simplifyTimlinesAndSave(savedTimeline, savedBroadcast);
    } else {
      sendTelegramMessage(`[${getNow()}] **실패** 방송 데이터가 제대로 저장되어 있지 않음`);
      return null;
    }
  }

  /**
   * 방송 전체 타임라임과 각 방송에 대한 정보를 조회하고 저장
   * 매일 한국시간으로 23시 30분 55초에 실행
   */
  @Cron('55 30 23 * * *', { timeZone: DEFAULT_TIMEZONE })
  async dailyCron() {
    const tomorrow: string = getTomorrowString();
    return this._handleCron(tomorrow);
  }

  /**
   * 방송 전체 타임라임과 각 방송에 대한 정보를 조회하고 저장
   * 매일 한국시간으로 09~21시 25, 55분 55초에 실행
   */
  @Cron('55 25,55 9-21 * * *', { timeZone: DEFAULT_TIMEZONE })
  async hourlyCron() {
    const today: string = getTodayString();
    return this._handleCron(today);
  }

  /**
   * 개발할 때 사용하는 테스트용 (평소에는 주석처리)
   */
  // @Cron('50 36 8 * * *', { timeZone: DEFAULT_TIMEZONE })
  // async testCron() {
  //   const today: string = getTodayString();
  //   await this._handleCron(today);
  // }
}
