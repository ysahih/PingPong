import * as jwt from 'jsonwebtoken';

export function generateJwtToken(payload: any): string {
  const secretKey = 'essadike';
  const expiresIn = '1d';
  return jwt.sign(payload, secretKey, { expiresIn });
}
