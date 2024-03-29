import { BaseHttpException } from './base-http.exception';
import { HttpStatus } from '@nestjs/common';

/**
 * 데이터 충돌 Http Exception
 * statusCode: 409
 */
export class ConflictHttpException extends BaseHttpException {
  constructor(path: string, message: string) {
    super(path, message, HttpStatus.CONFLICT);
  }
}

/**
 * 이미 존재하는 경우 발생하는 Exception
 */
export class AlreadyExistsHttpException extends ConflictHttpException {
  constructor(path: string, entity: string, key: string, value: string) {
    super(path, `${entity} with ${key} '${value}' is already exists.`); // 409
  }
}

/**
 * 계정이 이미 존재하는 경우 발생하는 Exception
 */
export class AccountAlreadyExistsHttpException extends AlreadyExistsHttpException {
  constructor(path, email) {
    super(path, 'Account', 'email', email);
  }
}
