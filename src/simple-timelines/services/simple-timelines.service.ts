import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SimpleTimeline, SimpleTimelineDocument } from '@simple-timelines/schemas/simple-timeline.schema';
import { Model } from 'mongoose';
import { CreateSimpleTimelineDto } from '@simple-timelines/dtos/create-simple-timeline.dto';

@Injectable()
export class SimpleTimelinesService {
  constructor(@InjectModel(SimpleTimeline.name) private readonly simpleTimelineModel: Model<SimpleTimelineDocument>) {}

  /**
   * 생성
   * @param createSimpleTimeline
   */
  async create(createSimpleTimeline: CreateSimpleTimelineDto): Promise<SimpleTimeline> {
    const createdSimpleTimeline = new this.simpleTimelineModel(createSimpleTimeline);
    return createdSimpleTimeline.save();
  }

  /**
   * 조회
   * @param date
   */
  async findLatest(date: string) {
    let simpleTimeline = await this.simpleTimelineModel.findOne({ date }).sort({ updatedAt: -1 });

    if (!simpleTimeline) {
      simpleTimeline = await this.simpleTimelineModel.findOne().sort({ updatedAt: -1 });
    }

    return simpleTimeline;
  }

  /**
   * 최신 데이터 조회 후 갱신
   * @param date
   * @param createTimeline
   */
  async findLatestAndOverwrite(updateSimpleTimeline: CreateSimpleTimelineDto): Promise<SimpleTimeline> {
    let updatedSimpleTimeline = await this.simpleTimelineModel.findOneAndUpdate(
      { date: updateSimpleTimeline.date },
      { simpleBroadcasts: updateSimpleTimeline.simpleBroadcasts },
      {
        new: true,
        upsert: true,
      },
    );

    return updatedSimpleTimeline;
  }
}
