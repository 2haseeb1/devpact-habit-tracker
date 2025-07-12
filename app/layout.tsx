// app/layout.tsx

import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { ThemeProvider } from '@/components/shared/ThemeProvider';
import { Navbar } from '@/components/shared/Navbar';
import { Toaster } from '@/components/ui/toaster'; // Toaster যোগ করা হচ্ছে

const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'HabitPact: Social Habit Tracker for Developers',
  description: 'Commit to your goals, track your progress, and get inspired by a community of builders.',
  // আপনি এখানে আরও মেটাডেটা যোগ করতে পারেন, যেমন আইকন
  icons: {
    icon: "/favicon.ico",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-screen flex-col">
            <Navbar />
            <div className="flex-1">
              {children}
            </div>
            {/* আপনি চাইলে এখানে একটি Footer কম্পোনেন্ট যোগ করতে পারেন */}
          </div>
          <Toaster /> {/* ফর্ম সাবমিশনের পর টোস্ট নোটিফিকেশন দেখানোর জন্য */}
        </ThemeProvider>
      </body>
    </html>
  );
}