// src/app/api/auth/[...nextauth]/route.js
import {DrizzleAdapter} from '@auth/drizzle-adapter';
import {db} from '@emran/lib/db';
import {eq} from 'drizzle-orm';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import {users, userSessions} from '@/db/schema/schema';
import {comparePassword} from '@util/passwordManage';
import {generateAccessToken, generateRefreshToken} from '@util/token';

export const authOptions = {
  // adapter: DrizzleAdapter(db),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: {label: 'Email', type: 'email'},
        password: {label: 'Password', type: 'password'},
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email))
          .execute()
          .then((res) => res[0]);

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await comparePassword(
          credentials.password,
          user.password,
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id.toString(),
          email: user.email,
          name: user.name,
          image: user.profilePhoto,
          role: user.roleId,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({user, account, profile}) {
      console.log('SignIn callback - Provider:', account?.provider);
      console.log('User data:', user);
      if (account?.provider === 'google') {
        try {
          const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.email, user.email))
            .execute()
            .then((res) => res[0]);

          if (!existingUser) {
            await db.insert(users).values({
              email: user.email,
              name: user.name || '',
              profilePhoto: user.image || '',
              provider: 'google',
              googleId: account.providerAccountId,
            });
          } else if (existingUser.provider !== 'google') {
            await db
              .update(users)
              .set({
                googleId: account.providerAccountId,
                profilePhoto: user.image || existingUser.profilePhoto,
              })
              .where(eq(users.id, existingUser.id));
          }
        } catch (error) {
          console.error('Error during Google sign in:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({token, user, account}) {
      if (user) {
        const dbUser = await db
          .select()
          .from(users)
          .where(eq(users.email, user.email))
          .execute()
          .then((res) => res[0]);

        if (dbUser) {
          token.userId = dbUser.id;
          token.role = dbUser.roleId;
          token.name = dbUser.name;
          token.image = dbUser.profilePhoto;

          token.accessToken = generateAccessToken({
            userId: dbUser.id,
            name: dbUser.name,
            role: dbUser.roleId,
          });
          token.refreshToken = generateRefreshToken(dbUser.id);

          await db.insert(userSessions).values({
            userId: dbUser.id,
            refreshToken: token.refreshToken,
            userAgent: null,
            ipAddress: null,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          });
        }
      }
      return token;
    },
    async session({session, token}) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.userId,
          role: token.role,
          accessToken: token.accessToken,
          refreshToken: token.refreshToken,
        },
      };
    },
  },
  pages: {
    signIn: '/signin', // Fixed path
  },
  session: {
    strategy: 'jwt',
  },
};

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};
