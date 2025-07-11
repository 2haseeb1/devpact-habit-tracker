

#### **২. `lib/auth.ts` (Full Server-Side Config)**
এটি আপনার মূল Auth.js কনফিগারেশন ফাইল, যা ডেটাবেস এবং provider-দের সাথে কাজ করে।

```ts
// lib/auth.ts
import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import { PrismaAdapter } from '@auth/prisma-adapter';
import prisma from './prisma';
import { authConfig } from './auth.config';

// এনভায়রনমেন্ট ভেরিয়েবল চেক
const GITHUB_ID = process.env.AUTH_GITHUB_ID;
const GITHUB_SECRET = process.env.AUTH_GITHUB_SECRET;

if (!GITHUB_ID) { throw new Error('Missing AUTH_GITHUB_ID'); }
if (!GITHUB_SECRET) { throw new Error('Missing AUTH_GITHUB_SECRET'); }


export const { handlers, auth, signIn, signOut } = NextAuth({
  /**
   * `auth.config.ts` থেকে `pages`, `secret`, `trustHost` স্প্রেড করা হচ্ছে।
   * `authorized` কলব্যাকটিও এখানে merge হবে, যা middleware ব্যবহার করবে।
   */
  ...authConfig,
  
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },

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


// lib/prisma.ts

import { PrismaClient } from '@prisma/client';

// TypeScript-এর জন্য global namespace-এ prisma প্রপার্টি যোগ করা হচ্ছে
// এটি নিশ্চিত করে যে আমরা টাইপ-সেফটি বজায় রাখতে পারি
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Prisma Client-এর একটি ইনস্ট্যান্স তৈরি করা হচ্ছে।
// যদি `globalThis.prisma` আগে থেকেই থাকে (ডেভেলপমেন্ট পরিবেশে হট-রিলোডিং-এর কারণে),
// তাহলে সেটিই ব্যবহার করা হবে। না থাকলে, একটি নতুন ইনস্ট্যান্স তৈরি হবে।
const prisma = globalThis.prisma || new PrismaClient({
    // আপনি চাইলে এখানে লগিং অপশন যোগ করতে পারেন, যা ডেভেলপমেন্টের জন্য সহায়ক
    // log: ['query', 'info', 'warn', 'error'],
});

// ডেভেলপমেন্ট পরিবেশে, আমরা ইনস্ট্যান্সটিকে globalThis অবজেক্টে সেভ করে রাখি,
// যাতে পরবর্তী হট-রিলোডে এটি পুনরায় ব্যবহার করা যায়।
if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

// সবশেষে, এই সিঙ্গেল ইনস্ট্যান্সটিকে এক্সপোর্ট করা হচ্ছে,
// যাতে অ্যাপ্লিকেশনের যেকোনো জায়গা থেকে এটি ইম্পোর্ট করে ব্যবহার করা যায়।
export default prisma;