import { Hero } from "@/components/home/hero";
import { Stats } from "@/components/home/stats";
import { ModuleGrid } from "@/components/home/module-grid";
import { AIPreview } from "@/components/home/ai-preview";
import { Trending } from "@/components/home/trending";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Trending />
      <Stats />
      <ModuleGrid />
      <AIPreview />
    </>
  );
}
