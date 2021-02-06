/**
 * 환경변수에서 불러옴
 */
const { APP_ENV, FE_HOST, FE_PORT }: NodeJS.ProcessEnv = process.env;

let FE_URL: string;

if (APP_ENV === 'local') {
  FE_URL = `${FE_HOST}:${FE_PORT}`;
} else {
  FE_URL = FE_HOST;
}

export { FE_URL };
