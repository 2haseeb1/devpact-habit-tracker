// app/(app)/feed/page.tsx

import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { UserAvatar } from '@/components/shared/UserAvatar';
import { KudoButton } from '@/components/habits/KudoButton';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default async function FeedPage() {
  const session = await auth();
  const currentUserId = session?.user?.id;

  const publicHabits = await prisma.habit.findMany({
    where: { isPublic: true },
    take: 20,
    orderBy: { createdAt: 'desc' },
    include: {
      author: true,
      kudos: true,
    },
  });

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Community Feed</h1>
        <p className="text-muted-foreground">
          See what other developers are working on and get inspired.
        </p>
      </header>

      <main className="space-y-6">
        {publicHabits.length > 0 ? (
          publicHabits.map(habit => {
            const userHasKudoed = habit.kudos.some(kudo => kudo.userId === currentUserId);

            return (
              <div key={habit.id} className="p-6 border rounded-lg bg-card shadow-sm space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Link href={`/${habit.author.username || habit.author.id}`}>
                      <UserAvatar
                        src={habit.author.image}
                        fallback={habit.author.name?.charAt(0).toUpperCase() ?? 'U'}
                        className="h-10 w-10"
                      />
                    </Link>
                    <div>
                      <Link href={`/${habit.author.username || habit.author.id}`} className="font-semibold hover:underline">
                        {habit.author.name}
                      </Link>
                      <p className="text-xs text-muted-foreground">
                        committed to a new pact
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(habit.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="pl-12">
                  <Link href={`/habits/${habit.id}`}>
                    <h2 className="text-xl font-bold hover:underline">{habit.title}</h2>
                  </Link>
                  {habit.description && (
                    <p className="mt-2 text-muted-foreground">{habit.description}</p>
                  )}
                  <div className="mt-4 flex items-center justify-between">
                     <div className="flex flex-wrap gap-2">
                        {habit.tags.map(tag => (
                          <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                      </div>
                      
                      {/* --- মূল পরিবর্তন এখানে --- */}
                      <KudoButton 
                          habitId={habit.id} 
                          initialKudosCount={habit.kudos.length}
                          userHasKudoed={userHasKudoed}
                      />

                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground">The community feed is empty right now. Be the first to make a public habit!</p>
          </div>
        )}
      </main>
    </div>
  );
}