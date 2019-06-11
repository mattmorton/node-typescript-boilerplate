import { NextFunction, Request, Response } from 'express';
import { CustomError } from '../util/error';
 
export const errorMiddleware = (error: CustomError, request: Request, response: Response, next: NextFunction) => {
  const status = error.status || 500;
  const message = error.message || 'Something went wrong';
  const name = error.name || 'error';
  const stack = error.stack;
  response
    .status(status)
    .send({
      status,
      name,
      message,
      stack
    })
}