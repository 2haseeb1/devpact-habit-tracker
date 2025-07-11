// app/api/auth/[...nextauth]/route.ts
import { handlers } from "@/lib/auth";
export const { GET, POST } = handlers;

// Prisma ব্যবহার করার জন্য এই রুটটি অবশ্যই Node.js এনভায়রনমেন্টে চলতে হবে
export const runtime = "nodejs";
