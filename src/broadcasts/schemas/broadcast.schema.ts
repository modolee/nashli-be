import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

/**
 * MongoDB 에서 사용하는 Type
 */
const { ObjectId } = Types;

/**
 * 개별 방송 테이블 (Collection)
 */
@Schema({
  collection: 'Broadcasts',
  timestamps: true,
  _id: true,
})
export class Broadcast {
  /**
   * 인덱스
   */
  @Prop({ type: String, default: () => new ObjectId() })
  _id: string;

  /**
   * 방송 날짜
   */
  @Prop({ type: String, required: true })
  date: string;

  /**
   * 상세 방송 데이터
   */
  @Prop({ type: Array })
  broadcastsDetail: [];
}

/**
 * 위에서 정의한 Class로 MongoDB를 위한 Schema를 생성
 */
export const BroadcastSchema = SchemaFactory.createForClass(Broadcast);

/**
 * Broadcast에 MongoDB Document 기본 속성을 결합
 */
export type BroadcastDocument = Broadcast & Document;
