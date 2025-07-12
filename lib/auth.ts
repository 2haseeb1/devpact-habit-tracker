// lib/auth.ts
import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./prisma";
import { authConfig } from "../auth.config";

const GITHUB_ID = process.env.AUTH_GITHUB_ID;
const GITHUB_SECRET = process.env.AUTH_GITHUB_SECRET;

if (!GITHUB_ID) {
  throw new Error("Missing AUTH_GITHUB_ID");
}
if (!GITHUB_SECRET) {
  throw new Error("Missing AUTH_GITHUB_SECRET");
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  // `authConfig`-কে স্প্রেড করার মাধ্যমে pages এবং authorized কলব্যাক আসছে
  ...authConfig,

  adapter: PrismaAdapter(prisma),

  /**
   * মূল পরিবর্তন: আমরা ডিফল্ট 'jwt' স্ট্র্যাটেজি ব্যবহার করছি।
   * এটি middleware-এর সাথে CSRF এবং সেশন হ্যান্ডলিং-এর জন্য সবচেয়ে স্থিতিশীল।
   */
  session: { strategy: "jwt" },

  providers: [
    GitHub({
      clientId: GITHUB_ID,
      clientSecret: GITHUB_SECRET,
      // আপনার কাস্টম প্রোফাইল ফাংশন
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
    ...authConfig.callbacks, // authorized কলব্যাকটি মার্জ করা হচ্ছে

    // `jwt` কলব্যাকটি একটি JWT তৈরি বা আপডেট করার সময় কল করা হয়
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },

    // `session` কলব্যাকটি JWT থেকে তথ্য নিয়ে session.user অবজেক্টে যোগ করে
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
      }
      return session;
    },
  },
});
