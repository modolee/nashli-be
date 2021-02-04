import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

/**
 * 데이터베이스 서비스
 */
@Injectable()
export class DatabaseService {
  /**
   * 생성자
   * @param connection 데이터베이스 커넥션
   */
  constructor(@InjectConnection() public readonly connection: Connection) {}
}
