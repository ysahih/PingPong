import * as jwt from 'jsonwebtoken';

export function generateJwtToken(payload: any): string {
  const sec = 'essadike';
  const exp = '1d';
  return jwt.sign(payload, sec, { expiresIn: exp});
}
