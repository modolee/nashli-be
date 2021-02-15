import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

/**
 * MongoDB 에서 사용하는 Type
 */
const { ObjectId } = Types;

/**
 * 방송 스케줄 테이블 (Collection)
 */
@Schema({
  collection: 'Timelines',
  timestamps: true,
  _id: true,
})
export class Timeline {
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
   * 타임라인 데이터
   */
  @Prop({ type: Array })
  broadcasts: any[];
}

/**
 * 위에서 정의한 Class로 MongoDB를 위한 Schema를 생성
 */
export const TimelineSchema = SchemaFactory.createForClass(Timeline);

/**
 * Timeline에 MongoDB Document 기본 속성을 결합
 */
export type TimelineDocument = Timeline & Document;
