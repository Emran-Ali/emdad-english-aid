import { db } from './drizzle';
import {users, userSessions} from '../db/schema/schema';
import {hashPassword, comparePassword} from '@/lib/utile/passwordManage';
import {generateAccessToken, generateRefreshToken} from '@/lib/utile/token';


export async function login(email, password, userAgent, ipAddress) {
  const user = await db.select().from(users).where(users.email.eq(email)).execute().then(res => res[0]);
  if (!user) throw new Error('User not found');

  const isPasswordValid = await comparePassword(password, user.password);
  if (!isPasswordValid) throw new Error('Invalid password');

  const accessToken = generateAccessToken(user.id);
  const refreshToken = generateRefreshToken(user.id);

  await db.insert(userSessions).values({
    userId: user.id,
    refreshToken,
    userAgent,
    ipAddress,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return { accessToken, refreshToken };
}
