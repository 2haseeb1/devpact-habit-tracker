// middleware.ts
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  /**
   * middleware শুধুমাত্র এই রুটগুলোতে চলবে।
   * এটি নিশ্চিত করে যে শুধুমাত্র লগইন করা ব্যবহারকারীরাই এই পেজগুলো দেখতে পারবে।
   */
  matcher: [
    "/dashboard/:path*",
    "/feed/:path*",
    "/habits/:path*",
    "/settings/:path*",
  ],
};
