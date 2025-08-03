import 'dotenv/config';
import {NextResponse} from 'next/server';
import {generateAccessToken, generateRefreshToken} from '@util/token';
import {db} from '@emran/lib/db';
import {eq} from 'drizzle-orm';
import {users, userSessions} from '@/db/schema/schema';
import {comparePassword} from '@util/passwordManage';

export async function POST(req) {
  const {email, password} = await req.json();
  const userAgent = req.headers.get('user-agent') || null;
  const ipAddress = req.ip || null;

  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .execute()
      .then((res) => res[0]);

    if (!user || !(await comparePassword(password, user.password))) {
      return NextResponse.json({error: 'Invalid credentials'}, {status: 401});
    }

    const accessToken = generateAccessToken({
      userId: user.id,
      name: user.name,
      role: user.role,
    });
    const refreshToken = generateRefreshToken(user.id);

    return new Response(
      JSON.stringify({
        message: 'Batch fetched successfully',
        data: {
          accessToken,
          refreshToken,
          user: {
            id: user.id,
            name: user.name,
            role: user.role,
            image: user.profile_photo,
          },
        },
      }),
      {status: 200},
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json({error: 'Something went wrong'}, {status: 500});
  }
}
