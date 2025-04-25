import jwt from 'jsonwebtoken';
import { db } from './drizzle';
import { userSessions } from './schema';
import { generateAccessToken } from './tokens';
import 'dotenv/config'

export async function refreshAccessToken(refreshToken) {
  const session = await db
    .select()
    .from(userSessions)
    .where(userSessions.refreshToken.eq(refreshToken).and(userSessions.isRevoked.isFalse()))
    .execute()
    .then(res => res[0]);

  if (!session) throw new Error('Session invalid or revoked');

  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
  const newAccessToken = generateAccessToken(decoded.userId);

  return { accessToken: newAccessToken };
}
