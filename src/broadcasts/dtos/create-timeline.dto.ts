export interface CreateBroadcastDto {
  /**
   * 방송 날짜
   */
  date: string;

  /**
   * 개별 방송 데이터
   */
  broadcastsDetail: any[];
}
