// lib/actions/auth.actions.ts
"use server";

// We are importing the original `signOut` function from our main auth library
// and aliasing it as `nextAuthSignOut` to avoid naming conflicts.
import { signOut as nextAuthSignOut } from "@/lib/auth";

/**
 * A dedicated server action for handling user sign-out.
 * This can be called from client components via a form action.
 * After signing out, the user will be redirected to the homepage.
 */
export async function signOut() {
  await nextAuthSignOut({ redirectTo: "/" });
}

// Note: You could also create a `signIn` action here if needed,
// for example:
/*
import { signIn as nextAuthSignIn } from '@/lib/auth';

export async function signIn(provider: string, redirectTo: string) {
  await nextAuthSignIn(provider, { redirectTo });
}
*/
