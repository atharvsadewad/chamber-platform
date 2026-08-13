"use client";

import { Search, Hash, CalendarDays, FolderOpen, Scale } from "lucide-react";
import { BARE_ACT_SEARCH_METHODS } from "@/config/bare-acts";


export function BareActsSearch() {
  return (
    <section className="space-y-6">

      {/* Main Search */}

      <div className="flex flex-col gap-4 lg:flex-row">

        <div className="relative flex-1">

          <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />

          <input
            type="text"
            placeholder="Search Bare Acts, Rules, Sections, Notifications..."
            className="h-14 w-full rounded-xl border border-border bg-card pl-14 pr-5 text-sm outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
          />

        </div>

        <button className="h-14 rounded-xl bg-primary px-8 font-medium text-primary-foreground transition hover:opacity-90">

          Search

        </button>

      </div>

      {/* Search Methods */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">

        {BARE_ACT_SEARCH_METHODS.map((item) => {

          const Icon = item.icon;

          return (
            <button
              key={item.value}
              className="group rounded-xl border border-border bg-card p-5 text-left transition-all hover:border-primary hover:shadow-md"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">

                <Icon className="h-5 w-5 text-primary" />

              </div>

              <p className="text-xs uppercase tracking-wider text-muted-foreground">

                {item.title}

              </p>

              <h3 className="mt-1 font-semibold">

                {item.value}

              </h3>

            </button>
          );

        })}

      </div>

    </section>
  );
}