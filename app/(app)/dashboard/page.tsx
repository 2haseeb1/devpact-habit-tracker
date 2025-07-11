// app/(app)/dashboard/page.tsx

import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Button } from '@/components/ui/button';
import { HabitCard } from '@/components/habits/HabitCard'; // আমরা এই রি-ইউজেবল কার্ডটি ব্যবহার করব

export default async function DashboardPage() {
  const session = await auth();

  // middleware এটি রক্ষা করবে, কিন্তু এটি একটি অতিরিক্ত নিরাপত্তা স্তর
  if (!session?.user?.id) {
    redirect('/api/auth/signin');
  }

  // লগইন করা ব্যবহারকারীর সব অভ্যাস এবং তাদের আজকের দিনের লগ নিয়ে আসা হচ্ছে
  const habitsWithLogs = await prisma.habit.findMany({
    where: {
      authorId: session.user.id,
    },
    include: {
      // আমরা শুধুমাত্র আজকের দিনের লগটি খুঁজব, যাতে বুঝতে পারি অভ্যাসটি সম্পন্ন হয়েছে কি না
      logs: {
        where: {
          date: {
            // আজকের দিনের শুরু
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            // আজকের দিনের শেষ
            lt: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        },
      },
    },
    orderBy: {
      createdAt: 'asc', // পুরনো অভ্যাস আগে দেখাবে
    },
  });

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Habits Dashboard</h1>
          <p className="text-muted-foreground">
            Consistency is key. Keep up the great work!
          </p>
        </div>
        <Button asChild>
          <Link href="/habits/new">Add New Habit</Link>
        </Button>
      </header>

      <main>
        {habitsWithLogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {habitsWithLogs.map((habit) => (
              <HabitCard 
                key={habit.id}
                habit={habit}
                // যদি আজকের দিনের জন্য কোনো লগ থাকে, তাহলে অভ্যাসটি সম্পন্ন হয়েছে
                isCompletedToday={habit.logs.length > 0} 
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-20 border-2 border-dashed rounded-lg bg-secondary">
            <h2 className="text-2xl font-semibold">Your dashboard is empty!</h2>
            <p className="mt-2 text-muted-foreground">
              A new journey starts with a single step. Add your first habit.
            </p>
            <Button asChild className="mt-6">
              <Link href="/habits/new">Create Your First Habit</Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}