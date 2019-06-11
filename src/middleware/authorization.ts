import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../entity/user.entity';
import { verifyBearerToken } from '../util/encryption';
import { UnauthorizedError, ErrorMessage } from '../util/error';
import { stripPasswordFromEntity } from '../util/utilities';

export const authenticateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.headers.authorization) {
      return next(new UnauthorizedError(ErrorMessage.BEARER_TOKEN_REQUIRED));
    }
    const token = await verifyBearerToken(req.headers.authorization);
    if (!token) {
      return next(new UnauthorizedError(ErrorMessage.BEARER_TOKEN_INVALID));
    }
    const user = await getRepository(User).findOne({
      where: {
        id: token.id
      },
    })

    if (!user) {
      return next(new UnauthorizedError(ErrorMessage.USER_DOES_NOT_EXIST));
    }
    req.user = stripPasswordFromEntity(user);
    next();
  } catch (e) {
    next(e);
  }
}

export const authorizeAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user.isAdminUser()) {
      return next(new UnauthorizedError(ErrorMessage.ADMIN_ACCESS_REQUIRED));
    }
    next();
  } catch (e) {
    next(e);
  }
}