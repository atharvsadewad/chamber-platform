import Link from "next/link";
import {
  BookOpen,
  Landmark,
  Building2,
  FileText,
  Globe2,
  Scale,
} from "lucide-react";
import { BARE_ACT_CATEGORIES } from "@/config/bare-acts";

export function BareActsCategoryGrid() {
  return (
    <section>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

        {BARE_ACT_CATEGORIES.map((item) => {

          const Icon = item.icon;

          return (

            <Link
              key={item.id}
              href={item.href}
              className="group rounded-2xl border border-border bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-xl"
            >

              <div className="flex items-start justify-between">

                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl ${item.color}`}
                >
                  <Icon className="h-8 w-8" />
                </div>

                <span className="text-4xl font-serif font-bold text-muted-foreground/25">
                  {item.id}
                </span>

              </div>

              <h3 className="mt-7 text-2xl font-semibold">

                {item.title}

              </h3>

              <p className="mt-3 text-sm leading-7 text-muted-foreground">

                {item.description}

              </p>

              <div className="mt-8 flex items-center justify-between">

                <span className="text-sm font-medium text-primary">

                  {item.count}

                </span>

                <span className="text-xl transition-transform group-hover:translate-x-1">

                  →

                </span>

              </div>

            </Link>

          );
        })}
      </div>

    </section>
  );
}