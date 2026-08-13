import { BareActsSidebar } from "./bare-acts-sidebar";
import { BareActsSearch } from "./bare-acts-search";
import { BareActsCategoryGrid } from "./bare-acts-category-grid";

export function BareActsLayout() {
  return (
    <section className="container-laws-and-judgments py-10 lg:py-12">

      {/* Header */}

      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
          Bare Acts
        </p>

        <h1 className="mt-2 text-4xl font-serif font-bold">
          Bare Acts & Laws
        </h1>

        <p className="mt-3 max-w-3xl text-muted-foreground">
          Explore authentic Bare Acts, Rules, Regulations, Treaties and
          statutory instruments through a structured legal library.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">

        {/* Left Sidebar */}

        <BareActsSidebar />

        {/* Main */}

        <div className="space-y-8">

          <BareActsSearch />

          <BareActsCategoryGrid />

        </div>

      </div>

    </section>
  );
}