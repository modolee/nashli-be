import { HttpStatus } from '@nestjs/common';
import { BaseHttpException } from '@common/exceptions/base-http.exception';

/**
 * 실행 권한 없음 Http Exception
 * statusCode : 403
 */
export class UnauthorizedHttpException extends BaseHttpException {
  constructor(path: string, message: string) {
    super(path, message, HttpStatus.FORBIDDEN);
  }
}

/**
 * 해당 Role 만 접근 권한이 있음
 * statusCode : 403
 */
export class OnlyGrantedForRoleHttpException extends UnauthorizedHttpException {
  roles: string[];
  constructor(path: string, roles: string[]) {
    super(path, `It is only granted for ${roles.join(', ')}`);
    this.roles = roles;
  }
}

/**
 * Owner 만 접근 권한이 있음
 * statusCode : 403
 */
export class OnlyGrantedForOwnerHttpException extends UnauthorizedHttpException {
  roles: string[];
  constructor(path: string) {
    super(path, `It is only granted for OWNER`);
  }
}

/**
 * 해당 Role과 Owner 만 접근 권한이 있음
 * statusCode : 403
 */
export class OnlyGrantedForRoleAndOwnerHttpException extends UnauthorizedHttpException {
  roles: string[];
  constructor(path: string, roles: string[]) {
    super(path, `It is only granted for ${roles.join(', ')} and OWNER`);
  }
}
