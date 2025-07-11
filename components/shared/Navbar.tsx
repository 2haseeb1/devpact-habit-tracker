// components/shared/Navbar.tsx

import Link from 'next/link';
import { auth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { UserNav } from '@/components/shared/UserNav';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { PenSquare } from 'lucide-react';

function SignInButton() {
  return (
    <Button asChild>
      <Link href="/api/auth/signin">Sign In</Link>
    </Button>
  );
}

export async function Navbar() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
      <nav className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold sm:inline-block">HabitTracker</span>
          </Link>
          {session?.user && (
             <Link href="/dashboard" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
                Dashboard
             </Link>
          )}
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          {session?.user && (
             <Button variant="ghost" size="sm" asChild>
                <Link href="/habits/new" className="flex items-center gap-2">
                   <PenSquare className="h-4 w-4" />
                   <span className="hidden sm:inline">New Habit</span>
                </Link>
             </Button>
          )}

          <ThemeToggle />

          {session?.user ? <UserNav user={session.user} /> : <SignInButton />}
        </div>
      </nav>
    </header>
  );
}