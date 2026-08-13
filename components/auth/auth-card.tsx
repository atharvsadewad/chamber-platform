import { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";

interface AuthCardProps {
  children: ReactNode;
}

export function AuthCard({ children }: AuthCardProps) {
  return (
    <Card className="border-border/60 shadow-lg shadow-black/[0.03] rounded-2xl">
      <CardContent className="px-8 py-7 sm:px-10 sm:py-8">
        {children}
      </CardContent>
    </Card>
  );
}