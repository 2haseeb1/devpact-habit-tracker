// lib/actions/habit.actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";

// ফর্মের State-এর জন্য একটি টাইপ ডিফাইন করা হচ্ছে
type FormState = {
  error:
    | {
        title?: string[];
        description?: string[];
        isPublic?: string[];
        // অন্যান্য 필드গুলোর জন্য...
      }
    | string
    | null;
} | null;

const CreateHabitSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long." }),
  description: z.string().optional(),
  isPublic: z.boolean(),
});

// --- মূল পরিবর্তন এখানে: prevState-এর জন্য `FormState` টাইপ ব্যবহার করা হচ্ছে ---
export async function createHabit(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in to create a habit." };
  }

  const validatedFields = CreateHabitSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    isPublic: formData.get("isPublic") === "on",
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.flatten().fieldErrors };
  }

  const { title, description, isPublic } = validatedFields.data;

  try {
    await prisma.habit.create({
      data: {
        title,
        description,
        isPublic,
        authorId: session.user.id,
      },
    });
  } catch (dbError) {
    // --- মূল পরিবর্তন এখানে: 'error'-কে 'dbError' নাম দেওয়া হয়েছে এবং লগ করা হচ্ছে ---
    console.error("Database Error:", dbError);
    return {
      error: "Failed to create habit in the database. Please try again.",
    };
  }

  revalidatePath("/dashboard");
  redirect("/dashboard");

  // redirect একটি এরর থ্রো করে, তাই এই লাইনটি কখনও পৌঁছাবে না,
  // কিন্তু টাইপ সেফটির জন্য আমরা null রিটার্ন করতে পারি।
  return null;
}

export async function logHabit(habitId: string, shouldBeCompleted: boolean) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthenticated");
  }

  const today = new Date(new Date().setHours(0, 0, 0, 0));

  if (shouldBeCompleted) {
    await prisma.habitLog.upsert({
      where: {
        habitId_date_authorId: {
          habitId,
          authorId: session.user.id,
          date: today,
        },
      },
      update: { isCompleted: true },
      create: {
        habitId,
        authorId: session.user.id,
        date: today,
        isCompleted: true,
      },
    });
  } else {
    await prisma.habitLog.deleteMany({
      where: {
        habitId,
        authorId: session.user.id,
        date: today,
      },
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/feed");
}
