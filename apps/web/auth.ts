import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { authConfig } from "./auth.config";
import { sql } from "./app/lib/db";

type DatabaseUser = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
};

async function getUser(
  email: string
): Promise<DatabaseUser | undefined> {
  const users = (await sql`
    SELECT id, name, email, password_hash
    FROM users
    WHERE email = ${email}
    LIMIT 1;
  `) as DatabaseUser[];

  return users[0];
}

export const {
  auth,
  handlers,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
    providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            email: z.string().email(),
            password: z.string().min(8),
          })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const { email, password } = parsedCredentials.data;

        const user = await getUser(email.toLowerCase());

        if (!user) {
          return null;
        }

        const passwordsMatch = await bcrypt.compare(
          password,
          user.password_hash
        );

        if (!passwordsMatch) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }

      return session;
    },
  },
});