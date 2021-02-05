import { BROADCAST_API_ENDPOINT } from '@timelines/constants/url.constant';
import axios from 'axios';

/**
 * Broadcast 데이터 소스
 */
export class BroadcastRepository {
  public async getBroadcast(id) {
    try {
      const result = await axios.get(BROADCAST_API_ENDPOINT(id));

      if (result.status === 200) {
        return result.data;
      }
    } catch (error) {
      console.error(error);
    }

    return null;
  }
}
