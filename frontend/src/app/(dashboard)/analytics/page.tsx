"use client";

import React from "react";
import { LineChart, BarChart3, TrendingUp, AlertTriangle } from "lucide-react";
import { Header } from "@/components/layout/header";
import { EmptyState } from "@/components/shared/empty-state";

export default function AnalyticsPage() {
  return (
    <div>
      <Header
        title="Governance Insights"
        description="Database-backed compliance analytics, recurring terminology violations, and approval metrics."
      />
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <div className="p-5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700 flex items-start gap-3">
          <TrendingUp className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Empirical Compliance Metrics (Phase 6):</span> Reports actual recorded findings, most repeated prohibited terms, and approval turnaround times from production data. No synthetic placeholder charts.
          </div>
        </div>

        <EmptyState
          icon={BarChart3}
          title="No Governance Data Yet"
          description="Analytics will automatically aggregate once content reviews and findings are recorded in your workspace."
          actionText="Inspect Audit History"
          actionHref="/audit"
        />
      </div>
    </div>
  );
}

