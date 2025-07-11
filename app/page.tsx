// app/page.tsx

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Goal, Users } from 'lucide-react';

/**
 * এটি হলো হোমপেজ বা ল্যান্ডিং পেজ।
 * এটি একটি সার্ভার কম্পোনেন্ট।
 */
export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-8 py-16 md:py-24">
      
      {/* Hero Section */}
      <section className="space-y-4 max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter">
          Commit. Track. Achieve.
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground">
          DevPact is a social habit tracker designed for developers.
          Set your goals, log your progress daily, and get inspired by a community that builds in public.
        </p>
      </section>

      {/* Call to Action Button */}
      <section>
        <Button size="lg" asChild>
          <Link href="/dashboard">Get Started - It&apos;s Free</Link>
        </Button>
      </section>

      {/* Features Section */}
      <section className="w-full pt-16 md:pt-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {/* Feature 1 */}
          <div className="flex flex-col items-start space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="bg-primary/10 p-2 rounded-md">
              <Goal className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Define Your Pact</h3>
            <p className="text-muted-foreground">
              Create specific, measurable goals. Whether it&apos;s coding every day or mastering a new language, make a public commitment.
            </p>
          </div>
          
          {/* Feature 2 */}
          <div className="flex flex-col items-start space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="bg-primary/10 p-2 rounded-md">
              <CheckCircle2 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Log Your Progress</h3>
            <p className="text-muted-foreground">
              Stay accountable with daily check-ins. A simple click is all it takes to build a powerful streak and visualize your journey.
            </p>
          </div>
          
          {/* Feature 3 */}
          <div className="flex flex-col items-start space-y-2 rounded-lg border p-6 shadow-sm">
            <div className="bg-primary/10 p-2 rounded-md">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-bold">Get Inspired</h3>
            <p className="text-muted-foreground">
              Browse a public feed of habits from other developers. Give kudos, find motivation, and be part of a community of builders.
            </p>
          </div>
        </div>
      </section>
      
    </div>
  );
}