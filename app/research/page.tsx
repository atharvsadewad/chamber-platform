import { ResearchLayout } from "@/components/research/research-layout";
import { ResearchSidebar } from "@/components/research/research-sidebar";
import { ResearchSearch } from "@/components/research/research-search";
import { ResearchResults } from "@/components/research/research-results";
import { ResearchAIPanel } from "@/components/research/research-ai-panel";
import { ResearchFilters } from "@/components/research/research-filters";
export default function ResearchPage() {
  return (
    <ResearchLayout
      sidebar={<ResearchSidebar />}
      assistant={<ResearchAIPanel />}
      content={
        <>
          <ResearchSearch />
          <ResearchFilters />
          <ResearchResults />
        </>
      }
    />
  );
}