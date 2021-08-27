/**
 * 환경변수에서 불러옴
 */
const { APP_ENV, FE_HOST, FE_PORT, FE_AD_FREE_HOST, PORT, API_SECRET }: NodeJS.ProcessEnv = process.env;

let FE_URL: string;
let FE_AD_FREE_URL: string;

if (APP_ENV === 'local') {
  FE_URL = `${FE_HOST}:${FE_PORT}`;
  FE_AD_FREE_URL = `${FE_AD_FREE_HOST}:${FE_PORT}`;
} else {
  FE_URL = FE_HOST;
  FE_AD_FREE_URL = FE_AD_FREE_HOST;
}

export { FE_URL, FE_AD_FREE_URL, PORT, API_SECRET };
