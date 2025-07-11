import { PrismaClient } from "@prisma/client";

// TypeScript-এর জন্য global namespace-এ prisma প্রপার্টি যোগ করা হচ্ছে
// এটি নিশ্চিত করে যে আমরা টাইপ-সেফটি বজায় রাখতে পারি
declare global {

  var prisma: PrismaClient | undefined;
}

// Prisma Client-এর একটি ইনস্ট্যান্স তৈরি করা হচ্ছে।
// যদি `globalThis.prisma` আগে থেকেই থাকে (ডেভেলপমেন্ট পরিবেশে হট-রিলোডিং-এর কারণে),
// তাহলে সেটিই ব্যবহার করা হবে। না থাকলে, একটি নতুন ইনস্ট্যান্স তৈরি হবে।
const prisma =
  globalThis.prisma ||
  new PrismaClient({
    // আপনি চাইলে এখানে লগিং অপশন যোগ করতে পারেন, যা ডেভেলপমেন্টের জন্য সহায়ক
    // log: ['query', 'info', 'warn', 'error'],
  });

// ডেভেলপমেন্ট পরিবেশে, আমরা ইনস্ট্যান্সটিকে globalThis অবজেক্টে সেভ করে রাখি,
// যাতে পরবর্তী হট-রিলোডে এটি পুনরায় ব্যবহার করা যায়।
if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}

// সবশেষে, এই সিঙ্গেল ইনস্ট্যান্সটিকে এক্সপোর্ট করা হচ্ছে,
// যাতে অ্যাপ্লিকেশনের যেকোনো জায়গা থেকে এটি ইম্পোর্ট করে ব্যবহার করা যায়।
export default prisma;
