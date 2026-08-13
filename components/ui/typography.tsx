import * as React from "react";

import { cn } from "@/lib/utils";

type TextProps<T extends React.ElementType> = {
  as?: T;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

/**
 * Laws & Judgments's typography scale.
 *
 * - Display / H1–H3 use the Fraunces serif for editorial authority.
 * - Body copy uses Inter for density and legibility.
 * - Citation renders in IBM Plex Mono, matching the fixed-width
 *   convention of real legal citations (e.g. 410 U.S. 113).
 */

export function Display({ as, className, children, ...props }: TextProps<"h1">) {
  const Comp = as ?? "h1";
  return (
    <Comp
      className={cn(
        "text-balance font-serif text-4xl font-medium leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

export function H1({ as, className, children, ...props }: TextProps<"h1">) {
  const Comp = as ?? "h1";
  return (
    <Comp
      className={cn(
        "font-serif text-3xl font-medium leading-tight tracking-tight sm:text-4xl",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

export function H2({ as, className, children, ...props }: TextProps<"h2">) {
  const Comp = as ?? "h2";
  return (
    <Comp
      className={cn(
        "font-serif text-2xl font-medium leading-snug tracking-tight sm:text-3xl",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

export function H3({ as, className, children, ...props }: TextProps<"h3">) {
  const Comp = as ?? "h3";
  return (
    <Comp
      className={cn(
        "font-serif text-xl font-medium leading-snug tracking-tight",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

export function Lead({ as, className, children, ...props }: TextProps<"p">) {
  const Comp = as ?? "p";
  return (
    <Comp
      className={cn(
        "text-balance text-lg leading-relaxed text-muted-foreground sm:text-xl",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

export function Text({ as, className, children, ...props }: TextProps<"p">) {
  const Comp = as ?? "p";
  return (
    <Comp
      className={cn("text-[15px] leading-relaxed text-foreground/90", className)}
      {...props}
    >
      {children}
    </Comp>
  );
}

export function Muted({ as, className, children, ...props }: TextProps<"p">) {
  const Comp = as ?? "p";
  return (
    <Comp
      className={cn("text-sm leading-relaxed text-muted-foreground", className)}
      {...props}
    >
      {children}
    </Comp>
  );
}

export function Eyebrow({ as, className, children, ...props }: TextProps<"span">) {
  const Comp = as ?? "span";
  return (
    <Comp
      className={cn(
        "inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-accent",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

/** Fixed-width citation text, e.g. case numbers or docket IDs. */
export function Citation({ as, className, children, ...props }: TextProps<"span">) {
  const Comp = as ?? "span";
  return (
    <Comp
      className={cn("font-mono text-[13px] tracking-tight text-muted-foreground", className)}
      {...props}
    >
      {children}
    </Comp>
  );
}
