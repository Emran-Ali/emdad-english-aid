import jwt from 'jsonwebtoken';
import 'dotenv/config'

export function generateAccessToken(userId){
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
}

export function generateRefreshToken(userId) {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
}
