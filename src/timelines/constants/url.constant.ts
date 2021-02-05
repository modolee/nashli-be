export const TIMELINE_API_ENDPOINT = (next, size = 100) =>
  `https://apis.naver.com/selectiveweb/selectiveweb/v1/lives/timeline/daily?next=${next}&size=${size}`;

export const BROADCAST_API_ENDPOINT = id =>
  `https://apis.naver.com/selectiveweb/live_commerce_web/v2/broadcast-bridge/${id}`;
