import Link from "next/link";
import { ArrowRight, Scale, Sparkles } from "lucide-react";

import { SearchBar } from "@/components/ui/search";
import { Button } from "@/components/ui/button";
import { Display, Eyebrow, Lead } from "@/components/ui/typography";

const POPULAR_SEARCHES = [
  "Bharatiya Nyaya Sanhita",
  "Article 21",
  "Companies Act 2013",
  "Cheque Bounce",
  "Consumer Protection Act",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">

      {/* Background Glow */}

      <div className="container-laws-and-judgments relative py-20 lg:py-28">

        <div className="mx-auto max-w-5xl text-center">

          <Eyebrow className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2">
            <Scale className="h-4 w-4 text-primary" />
            India's Modern Legal Research Platform
          </Eyebrow>

          <Display className="mt-8 text-balance">
            Every Law. 
            <span className="text-primary"> Every Judgment.</span>
            <br />
            One Platform.
          </Display>

          <Lead className="mx-auto mt-8 max-w-3xl text-lg">
            Search Bare Acts, Judgments, Legal Drafts, Procedures,
            Legal Dictionary and AI-powered legal explanations —
            all from one unified platform.
          </Lead>

          <div className="mx-auto mt-12 max-w-3xl">
            <SearchBar />
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">

            {POPULAR_SEARCHES.map((item) => (
              <Link
                key={item}
                href={`/research?q=${encodeURIComponent(item)}`}
                className="rounded-full border border-border bg-card px-4 py-2 text-sm transition hover:border-primary hover:text-primary"
              >
                {item}
              </Link>
            ))}

          </div>

          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">

            <Button size="lg" variant="accent" asChild>
              <Link href="/research">
                Start Research
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button size="lg" variant="outline" asChild>
              <Link href="/laws-and-judgments-ai">
                <Sparkles className="mr-2 h-4 w-4" />
                Try AI Assistant
              </Link>
            </Button>

          </div>

        </div>

      </div>
    </section>
  );
}