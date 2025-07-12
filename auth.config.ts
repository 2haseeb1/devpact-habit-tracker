// auth.config.ts

import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/api/auth/signin",
  },

  secret: process.env.AUTH_SECRET,
  trustHost: true,

  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;

      const protectedRoutes = ["/dashboard", "/feed", "/habits", "/settings"];

      const isProtectedRoute = protectedRoutes.some((route) =>
        nextUrl.pathname.startsWith(route)
      );

      if (isProtectedRoute) {
        if (isLoggedIn) return true; // Allow access if on a protected route and logged in.
        return false; // Otherwise, redirect to the sign-in page.
      }

      // Allow access to all other routes (e.g., homepage, auth pages) by default.
      return true;
    },
  },

  providers: [], // Must be empty for middleware config.
} satisfies NextAuthConfig;
