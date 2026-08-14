import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

function getSafeNextPath(value: string | null): string {
  if (!value) {
    return "/";
  }

  // Only allow internal application paths.
  // Prevents open-redirect vulnerabilities.
  if (!value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }

  return value;
}

function getSafeFlow(
  value: string | null,
): "signup" | "signin" {
  return value === "signup" ? "signup" : "signin";
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);

  const code = requestUrl.searchParams.get("code");

  const next = getSafeNextPath(
    requestUrl.searchParams.get("next"),
  );

  const flow = getSafeFlow(
    requestUrl.searchParams.get("flow"),
  );

  /*
   * No authorization code means the authentication
   * callback could not be completed.
   */
  if (!code) {
    return NextResponse.redirect(
      new URL(
        `/auth/sign-in?error=verification_failed&next=${encodeURIComponent(
          next,
        )}`,
        requestUrl.origin,
      ),
    );
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },

        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(
              ({ name, value, options }) => {
                cookieStore.set(name, value, options);
              },
            );
          } catch {
            // Cookie writes can fail in certain server contexts.
          }
        },
      },
    },
  );

  /*
   * Exchange the Supabase authorization code for
   * an authenticated session.
   */
  const { error } =
    await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error(
      "Auth callback error:",
      error.message,
    );

    return NextResponse.redirect(
      new URL(
        `/auth/sign-in?error=verification_failed&next=${encodeURIComponent(
          next,
        )}`,
        requestUrl.origin,
      ),
    );
  }

  /*
   * EMAIL SIGNUP / VERIFICATION
   *
   * Keep the user on the verification-success page first.
   * That page receives the original destination through `next`.
   *
   * Example:
   * /auth/verify-email?verified=true&next=/dictionary
   */
  if (flow === "signup") {
    return NextResponse.redirect(
      new URL(
        `/auth/verify-email?verified=true&next=${encodeURIComponent(
          next,
        )}`,
        requestUrl.origin,
      ),
    );
  }

  /*
   * GOOGLE / OAUTH / NORMAL SIGN-IN
   *
   * Authentication is complete, so send the user directly
   * back to the page where they started.
   *
   * Example:
   * /auth/sign-in?next=/dictionary
   *       ↓
   * Google authentication
   *       ↓
   * /auth/callback
   *       ↓
   * /dictionary
   */
  return NextResponse.redirect(
    new URL(next, requestUrl.origin),
  );
}