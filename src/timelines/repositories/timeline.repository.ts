import { TIMELINE_API_ENDPOINT } from '@timelines/constants/url.constant';
import axios from 'axios';

/**
 * Timeline 데이터 소스
 */
export class TimelineRepository {
  public async getTimeline(next: number) {
    try {
      const result = await axios.get(TIMELINE_API_ENDPOINT(next));

      if (result.status === 200) {
        return result.data;
      }
    } catch (error) {
      console.error(error);
    }

    return null;
  }
}
