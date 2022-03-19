export const TIMELINE_API_ENDPOINT = (next, size = 100) =>
  `https://apis.naver.com/selectiveweb/live_commerce_web/v1/broadcast/timeline/now?size=${size}&timestamp=${next}&top=true`;
