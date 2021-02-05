import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { SimpleBroadcast } from '@simple-timelines/schemas/simple-broadcast.schema';

/**
 * MongoDB 에서 사용하는 Type
 */
const { ObjectId } = Types;

/**
 * 단순화 시킨 타임라인 테이블 (Collection)
 */
@Schema({
  collection: 'SimpleTimelines',
  timestamps: true,
  _id: true,
})
export class SimpleTimeline {
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
  @Prop({ type: Object })
  simpleBroadcasts: {};
}

/**
 * 위에서 정의한 Class로 MongoDB를 위한 Schema를 생성
 */
export const SimpleTimelineSchema = SchemaFactory.createForClass(SimpleTimeline);

/**
 * SimpleTimeline에 MongoDB Document 기본 속성을 결합
 */
export type SimpleTimelineDocument = SimpleTimeline & Document;
