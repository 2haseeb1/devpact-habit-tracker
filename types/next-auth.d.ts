// types/next-auth.d.ts
import type { DefaultSession } from "next-auth";
import type { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  /**
   * JWT টোকেনের টাইপ প্রসারিত করা হচ্ছে
   */
  interface JWT extends DefaultJWT {
    id?: string;
    username?: string | null; // null-কে অনুমতি দেওয়া ভালো অভ্যাস
  }
}

declare module "next-auth" {
  /**
   * Session অবজেক্টের টাইপ প্রসারিত করা হচ্ছে
   */
  interface Session {
    user: {
      id: string;
      username?: string | null;
    } & DefaultSession["user"];
  }

  /**
   * মূল সমাধান এখানে: User টাইপটিকেও প্রসারিত করতে হবে
   */
  interface User {
    username?: string | null; // Prisma মডেলের সাথে মিল রেখে null-কে অনুমতি দিন
  }
}
