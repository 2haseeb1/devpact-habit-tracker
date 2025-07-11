// components/habits/HabitCard.tsx
'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle,  CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { logHabit } from '@/lib/actions/habit.actions';
import { Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Habit, HabitLog } from '@prisma/client';

type HabitCardProps = {
  habit: Habit & { logs: HabitLog[] };
  isCompletedToday: boolean;
};

export function HabitCard({ habit, isCompletedToday }: HabitCardProps) {
  const [completed, setCompleted] = useState(isCompletedToday);
  const [isPending, startTransition] = useTransition();

  const handleToggleCompletion = () => {
    startTransition(async () => {
      // Optimistic update: instantly change the UI
      setCompleted(prev => !prev);
      
      try {
        // Call the server action in the background
        await logHabit(habit.id, !completed);
      } catch (error) {
        // If the server action fails, revert the optimistic update
        setCompleted(prev => !prev); 
        console.error("Failed to update habit status:", error);
      }
    });
  };

  return (
    <Card className={cn(
      "flex h-full flex-col transition-all duration-200",
      completed && "border-green-500/50 bg-green-500/5"
    )}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="pr-4">
            <Link href={`/habits/${habit.id}`} className="hover:underline">
              {habit.title}
            </Link>
          </CardTitle>
          <Button
            variant={completed ? "secondary" : "outline"}
            size="icon"
            onClick={handleToggleCompletion}
            disabled={isPending}
            className={cn(
              "shrink-0 transition-colors",
              completed && "bg-green-600 text-white hover:bg-green-700"
            )}
            aria-label={completed ? "Mark as not complete" : "Mark as complete"}
          >
            {isPending ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Check className="h-5 w-5" />
            )}

          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {habit.description || 'No description provided.'}
        </p>
      </CardContent>
    </Card>
  );
}