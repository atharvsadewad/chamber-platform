import { Hero } from "@/components/home/hero";
import { ModuleGrid } from "@/components/home/module-grid";
import { AIPreview } from "@/components/home/ai-preview";
import { Stats } from "@/components/home/stats";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ModuleGrid />
      <AIPreview />
      <Stats />
    </>
  );
}