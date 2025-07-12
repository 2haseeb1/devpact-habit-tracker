// middleware.ts

import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  /**
   * middleware প্রায় সব রুটে চলবে, কিছু ব্যতিক্রম ছাড়া।
   * এই `matcher`-টি Next.js-এর ইন্টারনাল ফাইল এবং Auth.js-এর নিজস্ব
   * API রুটগুলোকে বাদ দিয়ে বাকি সব রুটে middleware চালাবে।
   * এটি রিডাইরেক্ট লুপ প্রতিরোধ করার জন্য সবচেয়ে নির্ভরযোগ্য পদ্ধতি।
   */
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico).*)"],
};
