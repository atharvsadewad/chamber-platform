import { supabase } from "@/providers/database/supabase";

function getSafeNextPath(next: string = "/"): string {
  if (!next.startsWith("/") || next.startsWith("//")) {
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

export async function signUp(
  email: string,
  password: string,
  fullName?: string,
  next: string = "/",
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: getCallbackUrl(next, "signup"),
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

export async function signInWithGoogle(
  next = "/",
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

export async function signOut() {
  const { error } =
    await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}

export async function resetPassword(
  email: string,
  next = "/workspace",
) {
  const safeNext = getSafeNextPath(next);

  /*
   * Password recovery intentionally uses a token-hash
   * flow instead of the PKCE code-exchange flow.
   *
   * This allows the reset email to be opened on a
   * different browser or device from the one that
   * requested the reset.
   *
   * The email template appends:
   *   token_hash
   *   type=recovery
   *
   * to this redirect URL.
   */
  const redirectTo =
    `${window.location.origin}/auth/recover` +
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

export async function resendVerificationEmail(
  email: string,
  next = "/",
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

export async function updatePassword(
  password: string,
) {
  const { data, error } =
    await supabase.auth.updateUser({
      password,
    });

  if (error) {
    throw error;
  }

  return data;
}