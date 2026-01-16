// src/app/api/auth/[...nextauth]/route.js
import {students, users} from '@/db/schema/schema';
import {db} from '@emran/lib/db';
import {comparePassword} from '@util/passwordManage';
import {generateAccessToken, generateRefreshToken} from '@util/token';
import {eq} from 'drizzle-orm';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions = {
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
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({user, account}) {
      if (account?.provider === 'google') {
        if (!user.email) {
          console.error('❌ Google account did not return an email');
          return false;
        }

        try {
          const existingUser = await db
            .select()
            .from(users)
            .where(eq(users.email, user.email))
            .execute()
            .then((res) => res[0]);

          // If user does not exist, insert both user and student record
          if (!existingUser) {
            const [newUser] = await db
              .insert(users)
              .values({
                email: user.email,
                name: user.name || 'No Name',
                profilePhoto: user.image || '',
                provider: 'google',
                googleId: account.providerAccountId,
                role: 'student',
              })
              .returning(); // So we get the inserted user's id

            // Now create the corresponding student
            await db.insert(students).values({
              userId: newUser.id,
              studentId: `STD-${newUser.id}`, // Optional: generate a placeholder ID
              guardianName: null,
              guardianContact: null,
              emergencyContact: null,
              bloodGroup: null,
            });
          }

          // If the user exists but has no Google ID, update their info
          else if (existingUser.provider !== 'google') {
            await db
              .update(users)
              .set({
                googleId: account.providerAccountId,
                profilePhoto: user.image || existingUser.profilePhoto,
              })
              .where(eq(users.id, existingUser.id));
          }
        } catch (error) {
          console.error('❌ Error during Google sign in:', error);
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
          token.role = dbUser.role;
          token.name = dbUser.name;
          token.image = dbUser.profilePhoto;

          token.accessToken = generateAccessToken({
            userId: dbUser.id,
            name: dbUser.name,
            role: dbUser.role,
          });
          token.refreshToken = generateRefreshToken(dbUser.id);
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
    signIn: '/signin',
  },
  session: {
    strategy: 'jwt',
  },
};

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};
