import { Injectable } from '@nestjs/common';

@Injectable()
export class SimpleTimelineService {
  constructor() {}

  async getSimpleTimeline() {
    return {
      date: '2021-02-05',
      broadcast: [
        {
          startAt: '10:00',
          title: '나이키1',
          directUrl: 'livebridge',
          bridgeUrl: 'lives',
          reward: 'yes', // yes, no, not sure
        },
        {
          startAt: '11:00',
          title: '나이키2',
          directUrl: 'livebridge',
          bridgeUrl: 'lives',
          reward: 'no',
        },
      ],
    };
  }
}
