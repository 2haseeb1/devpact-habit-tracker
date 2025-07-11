// components/habits/KudoButton.tsx
'use client';

import { useState, useTransition } from 'react';
import { toggleKudo } from '@/lib/actions/kudo.actions';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Heart } from 'lucide-react';

type KudoButtonProps = {
  habitId: string;
  initialKudosCount: number;
  userHasKudoed: boolean;
};

export function KudoButton({ habitId, initialKudosCount, userHasKudoed }: KudoButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [optimisticHasKudoed, setOptimisticHasKudoed] = useState(userHasKudoed);
  const [optimisticKudosCount, setOptimisticKudosCount] = useState(initialKudosCount);

  const handleClick = () => {
    startTransition(async () => {
      // Optimistic UI Update
      setOptimisticHasKudoed(prev => !prev);
      setOptimisticKudosCount(prev => (optimisticHasKudoed ? prev - 1 : prev + 1));
      
      // Background Server Action
      await toggleKudo(habitId);
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      disabled={isPending}
      className="flex items-center gap-2 text-muted-foreground"
    >
      <Heart className={cn(
        "h-5 w-5 transition-all", 
        optimisticHasKudoed && "fill-red-500 text-red-500"
      )} />
      <span>{optimisticKudosCount}</span>
    </Button>
  );
}