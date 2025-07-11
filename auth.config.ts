// auth.config.ts
import type { NextAuthConfig } from "next-auth";

// এই `authConfig`-এর টাইপ `NextAuthConfig` হওয়ায়,
// এর ভেতরের `authorized` কলব্যাকের প্যারামিটারগুলো স্বয়ংক্রিয়ভাবে টাইপ পেয়ে যায়।
export const authConfig = {
  pages: {
    signIn: "/api/auth/signin",
  },

  secret: process.env.AUTH_SECRET,
  trustHost: true,

  callbacks: {
    // TypeScript এখন জানে যে 'auth' এর টাইপ `Session | null` হবে
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      if (isOnDashboard) {
        return isLoggedIn;
      }
      return true;
    },
  },

  providers: [],
} satisfies NextAuthConfig;
