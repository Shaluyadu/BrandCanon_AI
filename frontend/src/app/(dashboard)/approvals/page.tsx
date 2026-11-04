"use client";

import React from "react";
import { CheckCircle2, ShieldCheck, UserCheck } from "lucide-react";
import { Header } from "@/components/layout/header";
import { EmptyState } from "@/components/shared/empty-state";

export default function ApprovalsPage() {
  return (
    <div>
      <Header
        title="Approval Workspace"
        description="Formal human-in-the-loop review queue for authorized decision-makers."
      />
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <div className="p-5 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Human Governance Lifecycle (Phase 5):</span> Authorized Reviewers inspect revisions, add comments, and record binding decisions (`APPROVED`, `REQUEST_CHANGES`, `REJECTED`). AI never auto-approves.
          </div>
        </div>

        <EmptyState
          icon={CheckCircle2}
          title="Approval Queue is Clear"
          description="There are currently no content submissions awaiting your review or decision."
          actionText="Workspace Overview"
          actionHref="/dashboard"
        />
      </div>
    </div>
  );
}

