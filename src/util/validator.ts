import { validate } from 'class-validator';
import { DataValidationError } from './error';

export const validateEntity = async(entity: any) => {
  const errors = await validate(entity);
  if (!errors.length) { return; }
  if (errors.length) {
    throw new DataValidationError(errors);
  }
}