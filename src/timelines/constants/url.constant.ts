export const TIMELINE_API_ENDPOINT = (next, size = 100) =>
  `https://apis.naver.com/selectiveweb/selectiveweb/v1/lives/timeline/daily?next=${next}&size=${size}`;
