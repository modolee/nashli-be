import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { MongooseModule } from '@nestjs/mongoose';
import { uri, config } from './orm.config';

/**
 * 데이터베이스 모듈
 *
 * Mongoose 모듈 설정
 */
@Module({
  imports: [MongooseModule.forRoot(uri, config)],
  providers: [DatabaseService],
})
export class DatabaseModule {
  constructor() {}
}
