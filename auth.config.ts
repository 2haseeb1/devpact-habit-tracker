// auth.config.ts
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/api/auth/signin",
  },

  secret: process.env.AUTH_SECRET,
  trustHost: true,

  callbacks: {
    authorized({ auth }) {
      const isLoggedIn = !!auth?.user;

      // Since the matcher is already filtering for protected routes,
      // the only thing we need to do here is check if the user is logged in.
      // If they are, auth object exists, isLoggedIn is true, and access is granted.
      // If they aren't, auth is null, isLoggedIn is false, and access is denied.
      // NextAuth will automatically redirect them to the signIn page on a `false` return.

      // For this architecture, a simple check is the most robust.
      // The logic to redirect logged-in users away from the login page
      // can be handled elsewhere or added here if needed, but this is the core.
      return isLoggedIn;
    },
  },

  providers: [], // Must be empty for middleware
} satisfies NextAuthConfig;
