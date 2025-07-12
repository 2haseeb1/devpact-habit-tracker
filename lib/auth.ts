// lib/auth.ts

import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./prisma";

// এই আর্কিটেকচারে, auth.config.ts-এর আর প্রয়োজন নেই,
// কারণ middleware সরাসরি এই ফাইল থেকে auth ইম্পোর্ট করতে পারে
// যদি আমরা এটিকে Edge-compatible রাখি। কিন্তু Prisma ব্যবহারের কারণে তা সম্ভব নয়।
// তাই আমরা আবার দ্বি-ফাইল পদ্ধতিতে ফিরে যাচ্ছি যা সবচেয়ে নির্ভরযোগ্য।
// অনুগ্রহ করে নিশ্চিত করুন যে আপনার auth.config.ts ফাইলটিও সঠিক আছে।

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
  // এই কনফিগারেশনটি auth.config.ts থেকে আসবে
  // pages: { signIn: '/api/auth/signin' },
  // secret: process.env.AUTH_SECRET,

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
    // `authorized` কলব্যাকের লজিকটি এখন auth.config.ts-এ থাকবে

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
