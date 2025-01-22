import 'dotenv/config'
import {NextResponse} from 'next/server';
import {generateAccessToken, generateRefreshToken} from "@/lib/utile/token";
import {db} from "@/lib/db";
import {eq} from "drizzle-orm";
import {users, userSessions} from "@/db/schema/schema";
import {comparePassword} from "@/lib/utile/passwordManage";


export async function POST(req) {
    const { phone, password } = await req.json();
    const userAgent = req.headers.get('user-agent') || null;
    const ipAddress = req.ip || null;

    try{
        const user = await db.select().from(users).where(eq(users.contactNumber , phone)).execute().then(res => res[0]);

        if (!user || !(await comparePassword(password, user.password))) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        await db.insert(userSessions).values({
            userId: user.id,
            refreshToken,
            userAgent,
            ipAddress,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        });

        const response = NextResponse.json({ message: 'Login successful' });

        response.cookies.set('authToken', accessToken, { httpOnly: true, secure: true });
        response.cookies.set('refreshToken', refreshToken, { httpOnly: true, secure: true });

        return response;
    }catch(error){
        return NextResponse.json({error: 'Something went wrong'}, {status: 500});
    }


}