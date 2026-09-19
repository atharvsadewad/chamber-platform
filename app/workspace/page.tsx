import type { Metadata } from "next";

import WorkspacePage from "@/components/workspace/workspace-page";

export const metadata: Metadata = {
  title: "Workspace",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function WorkspaceRoute() {
  return <WorkspacePage />;
}