import {
  BookOpen,
  Bookmark,
  Clock3,
  FileText,
  Gavel,
  Landmark,
  Library,
  Scale,
  Star,
} from "lucide-react";

const navigation = [
  {
    title: "Browse",
    items: [
      { icon: Landmark, label: "Supreme Court" },
      { icon: Library, label: "High Courts" },
      { icon: Gavel, label: "Tribunals" },
      { icon: Scale, label: "District Courts" },
    ],
  },
  {
    title: "Research",
    items: [
      { icon: BookOpen, label: "Acts Referenced" },
      { icon: FileText, label: "Legal Topics" },
      { icon: Star, label: "Landmark Cases" },
    ],
  },
  {
    title: "Workspace",
    items: [
      { icon: Bookmark, label: "Bookmarks" },
      { icon: Clock3, label: "Recent Research" },
    ],
  },
];

export function JudgmentsSidebar() {
  return (
    <div className="h-full">
      {/* Header */}
      <div className="border-b p-5">
        <h2 className="font-semibold">Research Navigator</h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Browse Indian case law and legal resources.
        </p>
      </div>

      {/* Navigation */}
      <div className="space-y-8 p-5">
        {navigation.map((group) => (
          <section key={group.title}>
            <p className="mb-3 text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {group.title}
            </p>

            <div className="space-y-1">
              {group.items.map((item) => (
                <button
                  key={item.label}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-secondary"
                >
                  <item.icon className="h-4 w-4 text-primary" />

                  <span className="text-sm">{item.label}</span>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}