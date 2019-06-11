import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';
import { sign, SignOptions, verify } from 'jsonwebtoken';

export const hashPassword = async(password: string) => {
  const saltRounds = 10;
  try {
    const genSalt = await bcrypt.genSalt(saltRounds);
    const hashPassword = await bcrypt.hash(password, genSalt);
    return hashPassword;
  } catch (err) {
    return err;
  }
}

export const comparePassword = async(userPlainPassword: string, userHashPassword: string) => {
  return await bcrypt.compare(userPlainPassword, userHashPassword);
}

export interface IBearerTokenPayload {
  id: number;
  iat: number;
  exp: number;
}

export const signBearerToken = (id: number) => {
  const signOptions: SignOptions = {
    expiresIn: 604800
  }
  const payload = { id };
  return sign(payload, process.env.JWT_SECRET, signOptions);
}

export const verifyBearerToken = (token: string) => {
  try {
    const tokenWithoutBearerPrefix = splitBearerTokenHeader(token)
    const tokenPayload: IBearerTokenPayload = verify(tokenWithoutBearerPrefix, process.env.JWT_SECRET) as IBearerTokenPayload;
    return tokenPayload;
  } catch (e) {
    console.log('eeeee', e)
  }
}

export const generateRandomToken = async() => {
  const buffer = await crypto.randomBytes(8);
  const token = buffer.toString('hex')
  return token;
}

const splitBearerTokenHeader = (bearerToken: string) => {
  return bearerToken.split(' ')[1];
}

