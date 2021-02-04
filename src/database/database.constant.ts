/**
 * 환경변수에서 불러옴
 */
const {
  MONGO_HOST,
  MONGO_PORT,
  MONGO_USERNAME,
  MONGO_PASSWORD,
  MONGO_DATABASE,
}: NodeJS.ProcessEnv = process.env;

/**
 * MONGO 관련 상수
 */
export const mongoConstants = {
  /**
   * Host 주소
   */
  host: MONGO_HOST,

  /**
   * Port 번호 (숫자로 파싱)
   */
  port: parseInt(MONGO_PORT),

  /**
   * 사용자 ID
   */
  user: MONGO_USERNAME,

  /**
   * 사용자 PW
   */
  password: MONGO_PASSWORD,

  /**
   * 데이터베이스 이름
   */
  db: MONGO_DATABASE,
};