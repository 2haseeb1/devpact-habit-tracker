// lib/actions/kudo.actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function toggleKudo(habitId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthenticated");
  }

  const userId = session.user.id;

  const existingKudo = await prisma.kudo.findUnique({
    where: {
      userId_habitId: {
        userId,
        habitId,
      },
    },
  });

  if (existingKudo) {
    await prisma.kudo.delete({
      where: { id: existingKudo.id },
    });
  } else {
    await prisma.kudo.create({
      data: {
        userId,
        habitId,
      },
    });
  }

  // ফিড এবং বিস্তারিত পেজ রি-ভ্যালিডেট করা
  revalidatePath("/feed");
  revalidatePath(`/habits/${habitId}`);
}
