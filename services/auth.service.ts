import { supabase } from "@/providers/database/supabase";

function getSafeNextPath(
  next: string = "/",
): string {
  if (
    !next.startsWith("/") ||
    next.startsWith("//")
  ) {
    return "/";
  }

  return next;
}

function getCallbackUrl(
  next: string = "/",
  flow: "signin" | "signup" = "signin",
) {
  const safeNext = getSafeNextPath(next);

  return (
    `${window.location.origin}/auth/callback` +
    `?flow=${flow}` +
    `&next=${encodeURIComponent(safeNext)}`
  );
}

/* ----------------------------------------
   Email Sign Up
----------------------------------------- */

export async function signUp(
  email: string,
  password: string,
  fullName?: string,
  next: string = "/",
) {
  const { data, error } =
    await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: getCallbackUrl(
          next,
          "signup",
        ),

        data: {
          full_name: fullName ?? "",
        },
      },
    });

  if (error) {
    throw error;
  }

  return data;
}

/* ----------------------------------------
   Email / Password Sign In
----------------------------------------- */

export async function signIn(
  email: string,
  password: string,
) {
  const { data, error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (error) {
    throw error;
  }

  return data;
}

/* ----------------------------------------
   Google Sign In
----------------------------------------- */

export async function signInWithGoogle(
  next: string = "/",
) {
  const redirectUrl = getCallbackUrl(
    next,
    "signin",
  );

  const { data, error } =
    await supabase.auth.signInWithOAuth({
      provider: "google",

      options: {
        redirectTo: redirectUrl,
      },
    });

  if (error) {
    throw error;
  }

  return data;
}

/* ----------------------------------------
   Sign Out
----------------------------------------- */

export async function signOut() {
  const { error } =
    await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}

/* ----------------------------------------
   Password Reset
----------------------------------------- */

export async function resetPassword(
  email: string,
  next: string = "/",
) {
  const safeNext = getSafeNextPath(next);

  const redirectTo =
    `${window.location.origin}/auth/update-password` +
    `?next=${encodeURIComponent(safeNext)}`;

  const { data, error } =
    await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo,
      },
    );

  if (error) {
    throw error;
  }

  return data;
}

/* ----------------------------------------
   Resend Verification Email
----------------------------------------- */

export async function resendVerificationEmail(
  email: string,
  next: string = "/",
) {
  const { data, error } =
    await supabase.auth.resend({
      type: "signup",
      email,

      options: {
        emailRedirectTo: getCallbackUrl(
          next,
          "signup",
        ),
      },
    });

  if (error) {
    throw error;
  }

  return data;
}