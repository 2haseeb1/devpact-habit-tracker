import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./prisma";
import { authConfig } from "@/auth.config";

// এনভায়রনমেন্ট ভেরিয়েবল চেক
const GITHUB_ID = process.env.AUTH_GITHUB_ID;
const GITHUB_SECRET = process.env.AUTH_GITHUB_SECRET;

if (!GITHUB_ID) {
  throw new Error("Missing AUTH_GITHUB_ID");
}
if (!GITHUB_SECRET) {
  throw new Error("Missing AUTH_GITHUB_SECRET");
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  /**
   * `auth.config.ts` থেকে `pages`, `secret`, `trustHost` স্প্রেড করা হচ্ছে।
   * `authorized` কলব্যাকটিও এখানে merge হবে, যা middleware ব্যবহার করবে।
   */
  ...authConfig,

  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },

  providers: [
    GitHub({
      clientId: GITHUB_ID,
      clientSecret: GITHUB_SECRET,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name ?? profile.login,
          email: profile.email,
          image: profile.avatar_url,
          username: profile.login,
        };
      },
    }),
  ],

  callbacks: {
    // `...authConfig.callbacks`-এর মাধ্যমে `authorized` কলব্যাকটি যুক্ত হয়ে গেছে।

    // JWT টোকেনকে সমৃদ্ধ করার জন্য
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
    // সেশন অবজেক্টকে সমৃদ্ধ করার জন্য
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
      }
      return session;
    },
  },
});

