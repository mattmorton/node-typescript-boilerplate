export class CustomError extends Error {
  status: number;
  message: string;
  constructor(status: number, message: string, stack?: any) {
    super(message);
    this.status = status;
    this.message = message;
    this.stack = stack;
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message: string) {
    super(401, message);
  }
}

export class DataNotFoundError extends CustomError {
  constructor(message: string) {
    super(404, message);
  }
}

export class DataValidationError extends CustomError {
  constructor(errors: any) {
    super(422, errors);
  }
}

export class UnprocessableEntityError extends CustomError {
  constructor(message: string, stack?: any) {
    super(422, message, stack)
  }
}

export enum ErrorMessage {
  PASSWORD_DOES_NOT_MATCH = 'PASSWORD_DOES_NOT_MATCH',
  USER_DOES_NOT_EXIST = 'USER_DOES_NOT_EXIST',
  USER_ALREADY_REGISTERED = 'USER_ALREADY_REGISTERED',
  BEARER_TOKEN_REQUIRED = 'BEARER_TOKEN_REQUIRED',
  BEARER_TOKEN_INVALID = 'BEARER_TOKEN_INVALID',
  BEARER_TOKEN_USER_NOT_FOUND = 'BEARER_TOKEN_USER_NOT_FOUND',
  TOKEN_NOT_FOUND = 'TOKEN_NOT_FOUND',
  UNVERIFIED_USER = 'UNVERIFIED_USER',
  INACTIVE_USER = 'INACTIVE_USER',
  ADMIN_ACCESS_REQUIRED = 'ADMIN_ACCESS_REQUIRED',
}