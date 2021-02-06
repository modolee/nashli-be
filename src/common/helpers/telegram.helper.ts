import axios from 'axios';

/**
 * TELEGRAM CHAT ID 확인 방법
 * https://api.telegram.org/bot{TELEGRAM_TOKEN}/getUpdates
 * Bot이랑 같이 있는 방에서 채팅 후 위의 URL에서 확인
 */

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN; // 텔레그램 API 사용을 위한 토큰
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID; // 메세지를 전송 할 텔레그램 채팅 ID
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage?chat_id=${TELEGRAM_CHAT_ID}&parse_mode=HTML&text=`;

export const sendTelegramMessage = async message => {
  try {
    const sendMessageApi = TELEGRAM_API_URL + encodeURI(message);
    await axios.get(sendMessageApi);
  } catch (err) {
    console.error(err);
  }
};
