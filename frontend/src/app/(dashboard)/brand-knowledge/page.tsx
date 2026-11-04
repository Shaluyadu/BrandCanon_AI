"use client";

import React from "react";
import { BookOpen, FileUp, Sparkles, ShieldCheck } from "lucide-react";
import { Header } from "@/components/layout/header";
import { EmptyState } from "@/components/shared/empty-state";

export default function BrandKnowledgeHubPage() {
  return (
    <div>
      <Header
        title="Brand Knowledge Hub"
        description="Single source of truth for guidelines, product specifications, claims, and terminology rules."
      />
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <div className="p-5 rounded-xl bg-orange-50/60 border border-orange-200 text-xs text-orange-800 flex items-start gap-3">
          <Sparkles className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Brand Knowledge Lifecycle (Phase 2):</span> This module manages the ingestion of DOCX/PDF guidelines, deterministic terminology rules, approved product claims, and human manager verification.
          </div>
        </div>

        <EmptyState
          icon={BookOpen}
          title="No Brand Guidelines Uploaded"
          description="Upload brand guideline documents and verified product facts to establish your organization's approved governance baseline."
          actionText="Workspace Members & Roles"
          actionHref="/members"
        />
      </div>
    </div>
  );
}

