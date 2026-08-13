"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { NAVIGATION } from "@/config/navigation";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  // Close mobile menu whenever the route changes.
  React.useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="border-b border-border bg-background">
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
                  : "text-muted-foreground hover:text-foreground"
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

          {/* Sign In */}
          <Button
            variant="ghost"
            size="sm"
            asChild
          >
            <Link href="/auth/sign-in">
              Sign In
            </Link>
          </Button>

          {/* Open Workspace */}
          <Button
            variant="accent"
            size="sm"
            asChild
          >
            <Link href="/auth/sign-up">
              Open Workspace
            </Link>
          </Button>
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />

          <Button
            variant="ghost"
            size="icon"
            type="button"
            aria-label={open ? "Close Menu" : "Open Menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((current) => !current)}
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
          className="border-t border-border bg-background lg:hidden"
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
                onClick={() => setOpen(false)}
                className={cn(
                  "rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}

            {/* AI Assistant */}
            <Link
              href="/ai"
              onClick={() => setOpen(false)}
              className="mt-2 flex items-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Sparkles className="h-4 w-4" />
              AI Assistant
            </Link>

            {/* Mobile Auth Actions */}
            <div className="mt-5 flex flex-col gap-3 border-t border-border pt-5">
              <Button
                variant="outline"
                asChild
              >
                <Link
                  href="/auth/sign-in"
                  onClick={() => setOpen(false)}
                >
                  Sign In
                </Link>
              </Button>

              <Button
                variant="accent"
                asChild
              >
                <Link
                  href="/auth/sign-up"
                  onClick={() => setOpen(false)}
                >
                  Open Workspace
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}