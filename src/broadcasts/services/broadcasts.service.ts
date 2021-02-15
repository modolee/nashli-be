import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Broadcast, BroadcastDocument } from '@broadcasts/schemas/broadcast.schema';
import { Model } from 'mongoose';
import { CreateBroadcastDto } from '@broadcasts/dtos/create-broadcast.dto';

@Injectable()
export class BroadcastsService {
  constructor(@InjectModel(Broadcast.name) private readonly broadcastModel: Model<BroadcastDocument>) {}

  /**
   * 생성
   * @param createBroadcast
   */
  async create(createBroadcast: CreateBroadcastDto): Promise<Broadcast> {
    const createdBroadcast = new this.broadcastModel(createBroadcast);
    return createdBroadcast.save();
  }

  /**
   * 최신 조회
   * @param date
   */
  async findLatest(date: string) {
    return this.broadcastModel.findOne({ date }).sort({ updatedAt: -1 });
  }

  /**
   * 최신 데이터 조회 후 갱신
   * @param updateBroadcast
   */
  async findLatestAndOverwrite(updateBroadcast: CreateBroadcastDto): Promise<Broadcast> {
    let updatedBroadcast = await this.broadcastModel.findOneAndUpdate(
      { date: updateBroadcast.date },
      { broadcastsDetail: updateBroadcast.broadcastsDetail },
      {
        new: true,
        upsert: true,
      },
    );

    return updatedBroadcast;
  }
}
