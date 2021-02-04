import { mongoConstants } from './database.constant';
import { MongooseModuleOptions } from '@nestjs/mongoose';

/**
 * MongoDB URI
 *
 * Local은 Docker를 이용하고 Dev, Prod는 MongoDB Atlas Cloud를 사용하기 때문에 서로 프로토콜이 다름.
 * 그리고 Dev, Prod는 Port를 사용하지 않음
 */
let uri;
if (process.env.APP_ENV === 'local') {
  uri = `mongodb://${mongoConstants.user}:${mongoConstants.password}@${mongoConstants.host}:${mongoConstants.port}/${mongoConstants.db}?authSource=admin`;
} else {
  uri = `mongodb+srv://${mongoConstants.user}:${mongoConstants.password}@${mongoConstants.host}/${mongoConstants.db}?authSource=admin`;
}

export { uri };

/**
 * Mongoose 설정
 *
 * 기본 설정 참고 : https://mongoosejs.com/docs/deprecations.html
 */
export const config: MongooseModuleOptions = {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true,
};
