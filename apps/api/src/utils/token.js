import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function signAccessToken(user) {
  return jwt.sign(
    { email: user.email, role: user.role?.name || user.role },
    env.jwtAccessSecret,
    { subject: user.id, expiresIn: env.jwtAccessExpiresIn }
  );
}

export function signRefreshToken(user) {
  return jwt.sign(
    { type: 'refresh' },
    env.jwtRefreshSecret,
    { subject: user.id, expiresIn: env.jwtRefreshExpiresIn }
  );
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, env.jwtRefreshSecret);
}
