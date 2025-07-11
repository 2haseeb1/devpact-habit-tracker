// components/auth/SignInButton.tsx
'use server'; // যেহেতু এটি signIn সার্ভার অ্যাকশন ব্যবহার করবে

import { signIn } from '@/lib/auth';
import { Button } from '@/components/ui/button';

export async function SignInButton() {
  return (
    <form
      action={async () => {
        'use server';
        // লগইনের পর ড্যাশবোর্ডে রিডাইরেক্ট করার জন্য redirectTo ব্যবহার করা হচ্ছে
        await signIn('github', { redirectTo: '/dashboard' });
      }}
    >
      <Button type="submit">Sign In with GitHub</Button>
    </form>
  );
}