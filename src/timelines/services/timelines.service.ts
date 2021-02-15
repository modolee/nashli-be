import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Timeline, TimelineDocument } from '@timelines/schemas/timeline.schema';
import { CreateTimelineDto } from '@timelines/dtos/create-timeline.dto';

@Injectable()
export class TimelinesService {
  constructor(@InjectModel(Timeline.name) private readonly timelineModel: Model<TimelineDocument>) {}

  /**
   * 생성
   * @param createTimeline
   */
  async create(createTimeline: CreateTimelineDto): Promise<Timeline> {
    const createdTimeline = new this.timelineModel(createTimeline);
    return createdTimeline.save();
  }

  /**
   * 조회
   * @param date
   */
  async findLatest(date: string) {
    return this.timelineModel.findOne({ date }).sort({ updatedAt: -1 });
  }

  /**
   * 최신 데이터 조회 후 갱신
   * @param updateTimeline
   */
  async findLatestAndOverwrite(updateTimeline: CreateTimelineDto): Promise<Timeline> {
    let updatedTimeline = await this.timelineModel.findOneAndUpdate(
      { date: updateTimeline.date },
      { broadcasts: updateTimeline.broadcasts },
      {
        new: true,
        upsert: true,
      },
    );

    return updatedTimeline;
  }
}
