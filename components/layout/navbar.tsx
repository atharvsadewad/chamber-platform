"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  Sparkles,
  LogOut,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { NAVIGATION } from "@/config/navigation";
import { cn } from "@/lib/utils";
import { supabase } from "@/providers/database/supabase";

const TOP_REVEAL_ZONE = 16;
const SCROLL_HIDE_THRESHOLD = 8;

type ProfileSummary = {
  full_name: string | null;
  avatar_url: string | null;
  role: "user" | "admin";
};

function getInitials(
  name: string | null,
  email: string | null,
) {
  const source =
    name?.trim() ||
    email?.split("@")[0] ||
    "U";

  const parts = source
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length >= 2) {
    const first = parts[0] ?? "";
    const last = parts[parts.length - 1] ?? first;

    return `${first.slice(0, 1)}${last.slice(0, 1)}`.toUpperCase();
  }

  return source
    .slice(0, 2)
    .toUpperCase();
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [open, setOpen] = React.useState(false);
  const [authenticated, setAuthenticated] = React.useState(false);
  const [authLoading, setAuthLoading] = React.useState(true);
  const [profile, setProfile] =
    React.useState<ProfileSummary | null>(null);
  const [email, setEmail] =
    React.useState("");
  const [visible, setVisible] = React.useState(true);

  const lastScrollY = React.useRef(0);
  const ticking = React.useRef(false);

  /*
   * Check the current Supabase session and keep the navbar
   * synchronized whenever authentication changes.
   */
  React.useEffect(() => {
    let mounted = true;

    async function loadProfile(
      userId: string,
    ) {
      const { data, error } = await supabase
        .from("profiles")
        .select(
          "full_name, avatar_url, role",
        )
        .eq("id", userId)
        .maybeSingle();

      if (!mounted) return;

      if (error) {
        console.error(
          "Navbar profile load error:",
          error,
        );
        setProfile(null);
        return;
      }

      setProfile(
        (data as ProfileSummary | null) ??
          null,
      );
    }

    async function loadSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      setAuthenticated(Boolean(session?.user));
      setEmail(session?.user?.email ?? "");

      if (session?.user) {
        void loadProfile(session.user.id);
      } else {
        setProfile(null);
      }

      setAuthLoading(false);
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;

        setAuthenticated(Boolean(session?.user));
        setEmail(session?.user?.email ?? "");

        if (session?.user) {
          void loadProfile(session.user.id);
        } else {
          setProfile(null);
        }

        setAuthLoading(false);
      },
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  /*
   * Hide the navbar while scrolling down and reveal it
   * immediately when the user scrolls upward.
   */
  React.useEffect(() => {
    function updateNavbarVisibility() {
      const currentScrollY = window.scrollY;

      /*
       * Always show the navbar at the top of the page.
       */
      if (currentScrollY <= 0) {
        setVisible(true);
        lastScrollY.current = 0;
        ticking.current = false;
        return;
      }

      const difference =
        currentScrollY - lastScrollY.current;

      /*
       * Scrolling down.
       */
      if (
        difference > SCROLL_HIDE_THRESHOLD &&
        !open
      ) {
        setVisible(false);
        lastScrollY.current = currentScrollY;
      }

      /*
       * Scrolling up even slightly.
       */
      if (difference < 0) {
        setVisible(true);
        lastScrollY.current = currentScrollY;
      }

      ticking.current = false;
    }

    function handleScroll() {
      if (ticking.current) return;

      ticking.current = true;
      window.requestAnimationFrame(updateNavbarVisibility);
    }

    /*
     * Moving the pointer to the very top of the viewport
     * reveals the navbar even when the user is not scrolling.
     */
    function handlePointerMove(
      event: PointerEvent,
    ) {
      if (event.clientY <= TOP_REVEAL_ZONE) {
        setVisible(true);
      }
    }

    lastScrollY.current = window.scrollY;

    window.addEventListener(
      "scroll",
      handleScroll,
      { passive: true },
    );

    window.addEventListener(
      "pointermove",
      handlePointerMove,
      { passive: true },
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll,
      );

      window.removeEventListener(
        "pointermove",
        handlePointerMove,
      );
    };
  }, [open]);

  /*
   * Close mobile menu whenever the route changes.
   */
  React.useEffect(() => {
    setOpen(false);
    setVisible(true);
  }, [pathname]);

  /*
   * Keep the navbar visible whenever the mobile menu is open.
   */
  React.useEffect(() => {
    if (open) {
      setVisible(true);
    }
  }, [open]);

  async function handleSignOut() {
    try {
      await supabase.auth.signOut();

      setAuthenticated(false);
      setProfile(null);
      setEmail("");

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Sign out error:", error);
    }
  }

  const displayName =
    profile?.full_name?.trim() ||
    email.split("@")[0] ||
    "Account";

  const initials = getInitials(
    profile?.full_name ?? null,
    email,
  );

  return (
    <div className="relative z-50 h-20">
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 w-full",
          "border-b border-border/70",
          "bg-background/80",
          "backdrop-blur-xl backdrop-saturate-150",
          "supports-[backdrop-filter]:bg-background/65",
          "shadow-[0_1px_20px_rgba(0,0,0,0.04)]",
          "transition-transform duration-300 ease-out",
          visible
            ? "translate-y-0"
            : "-translate-y-full",
        )}
      >
        {/* Main Navbar */}
        <div className="container-laws-and-judgments flex h-20 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            onClick={() => setOpen(false)}
            className="flex shrink-0 items-center pr-8 transition-opacity hover:opacity-90"
          >
            <div className="leading-none">
              <h1 className="font-serif text-[1.65rem] font-black tracking-tight text-primary">
                Laws &
              </h1>

              <p className="-mt-1 font-serif text-[1.55rem] font-black tracking-tight text-foreground">
                Judgments
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden items-center gap-9 lg:flex xl:gap-10"
            aria-label="Primary Navigation"
          >
            {NAVIGATION.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            ))}

            {/* AI Assistant */}
            <Link
              href="/ai"
              className="ml-2 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90"
            >
              <Sparkles className="h-4 w-4" />
              AI Assistant
            </Link>
          </nav>

          {/* Desktop Right */}
          <div className="hidden items-center gap-3 lg:flex">
            <ThemeToggle />

            {!authLoading && !authenticated && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                >
                  <Link href="/auth/sign-in">
                    Sign In
                  </Link>
                </Button>

                <Button
                  variant="accent"
                  size="sm"
                  asChild
                >
                  <Link href="/auth/sign-in">
                    Open Workspace
                  </Link>
                </Button>
              </>
            )}

            {!authLoading && authenticated && (
              <>
                <Link
                  href="/profile"
                  title="Profile & account"
                  aria-label="Profile & account"
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border text-xs font-semibold transition",
                    pathname.startsWith("/profile")
                      ? "border-primary/30 bg-primary/10 text-primary"
                      : "border-border bg-primary/10 text-primary hover:border-primary/30 hover:bg-primary/15",
                  )}
                >
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </Link>

                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                >
                  <Link href="/workspace">
                    Workspace
                  </Link>
                </Button>

                <Button
                  variant="accent"
                  size="sm"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </Button>
              </>
            )}
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />

            <Button
              variant="ghost"
              size="icon"
              type="button"
              aria-label={
                open
                  ? "Close Menu"
                  : "Open Menu"
              }
              aria-expanded={open}
              aria-controls="mobile-nav"
              onClick={() =>
                setOpen((current) => !current)
              }
            >
              {open ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {open && (
          <div
            id="mobile-nav"
            className="border-t border-border/70 bg-background/80 backdrop-blur-xl lg:hidden"
          >
            <nav
              className="container-laws-and-judgments flex flex-col gap-1 py-5"
              aria-label="Mobile Navigation"
            >
              {/* Main Navigation */}
              {NAVIGATION.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() =>
                    setOpen(false)
                  }
                  className={cn(
                    "rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                    pathname === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  {link.label}
                </Link>
              ))}

              {/* AI Assistant */}
              <Link
                href="/ai"
                onClick={() =>
                  setOpen(false)
                }
                className="mt-2 flex items-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Sparkles className="h-4 w-4" />
                AI Assistant
              </Link>

              {/* Mobile Auth Actions */}
              <div className="mt-5 flex flex-col gap-3 border-t border-border pt-5">
                {!authLoading &&
                  !authenticated && (
                    <>
                      <Button
                        variant="outline"
                        asChild
                      >
                        <Link
                          href="/auth/sign-in"
                          onClick={() =>
                            setOpen(false)
                          }
                        >
                          Sign In
                        </Link>
                      </Button>

                      <Button
                        variant="accent"
                        asChild
                      >
                        <Link
                          href="/auth/sign-in"
                          onClick={() =>
                            setOpen(false)
                          }
                        >
                          Open Workspace
                        </Link>
                      </Button>
                    </>
                  )}

                {!authLoading &&
                  authenticated && (
                    <>
                      <Link
                        href="/profile"
                        onClick={() =>
                          setOpen(false)
                        }
                        className="flex items-center gap-3 rounded-lg border border-border px-4 py-3"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          {profile?.avatar_url ? (
                            <img
                              src={profile.avatar_url}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            initials
                          )}
                        </span>

                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold">
                            {displayName}
                          </span>

                          <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <UserRound className="h-3 w-3" />
                            Profile & account
                          </span>
                        </span>
                      </Link>

                      <Button
                        variant="outline"
                        asChild
                      >
                        <Link
                          href="/workspace"
                          onClick={() =>
                            setOpen(false)
                          }
                        >
                          Workspace
                        </Link>
                      </Button>

                      <Button
                        variant="accent"
                        onClick={
                          handleSignOut
                        }
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                      </Button>
                    </>
                  )}
              </div>
            </nav>
          </div>
        )}
      </header>
    </div>
  );
}