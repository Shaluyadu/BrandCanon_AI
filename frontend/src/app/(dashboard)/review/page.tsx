"use client";

import React from "react";
import { Sparkles, ShieldCheck, FileSearch } from "lucide-react";
import { Header } from "@/components/layout/header";
import { EmptyState } from "@/components/shared/empty-state";

export default function ReviewStudioPage() {
  return (
    <div>
      <Header
        title="AI Review Studio"
        description="Split-screen evidence-grounded review interface with inline highlights, findings, and suggestions."
      />
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <div className="p-5 rounded-xl bg-purple-50/60 border border-purple-200 text-xs text-purple-800 flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Evidence-Grounded Review Engine (Phase 4):</span> Displays exact highlighted sentences, finding categories (`FACT_MISMATCH`, `PROHIBITED_TERM`), supporting quotes, and minimal suggestions.
          </div>
        </div>

        <EmptyState
          icon={FileSearch}
          title="No Active Content Review"
          description="Select or create a submission from the Content Submissions view to inspect findings and suggestions."
          actionText="Go to Content Submissions"
          actionHref="/submissions"
        />
      </div>
    </div>
  );
}

