"use client";

import React from "react";
import { FileCheck2, PlusCircle, Sparkles } from "lucide-react";
import { Header } from "@/components/layout/header";
import { EmptyState } from "@/components/shared/empty-state";

export default function ContentSubmissionsPage() {
  return (
    <div>
      <Header
        title="Content Submissions"
        description="Draft, version, and submit marketing and corporate copy for automated pre-publication governance."
      />
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <div className="p-5 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-blue-800 flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Content Review Studio (Phase 3 & 4):</span> Content creators submit copy or DOCX files for asynchronous AI-orchestrated factual and brand compliance checks.
          </div>
        </div>

        <EmptyState
          icon={FileCheck2}
          title="No Content Submissions Yet"
          description="Submit a new content draft to trigger automated terminology checks and evidence-backed fact verification."
          actionText="View Workspace Settings"
          actionHref="/workspace"
        />
      </div>
    </div>
  );
}

