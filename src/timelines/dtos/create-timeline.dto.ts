export interface CreateTimelineDto {
  /**
   * 방송 날짜
   */
  date: string;

  /**
   * 타임라인 데이터
   */
  broadcasts: any[];
}
