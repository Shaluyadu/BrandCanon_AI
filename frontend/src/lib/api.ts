import { APIResponse, AuthResponseData, MeResponseData, OrganisationDetail, OrganisationSettings } from "@/types/auth";
import { Member, PaginatedResult } from "@/types/member";
import { AuditLog } from "@/types/audit";
import {
  BrandProfile,
  BrandDocument,
  DocumentContent,
  ApprovedFact,
  TerminologyRule,
  TerminologyMatch,
  KnowledgeApproval,
  KnowledgeOverviewStats,
} from "@/types/brand";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/v1";

class ApiClient {
  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("brandcanon_token");
  }

  private getActiveOrgId(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("brandcanon_active_org_id");
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<APIResponse<T>> {
    const token = this.getToken();
    const activeOrgId = this.getActiveOrgId();

    const headers: Record<string, string> = {};

    if (!(options.body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    if (options.headers) {
      Object.assign(headers, options.headers);
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    if (activeOrgId) {
      headers["X-Organisation-Id"] = activeOrgId;
    }

    const url = `${API_BASE_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        credentials: "include",
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || {
            code: `HTTP_${response.status}`,
            message: data.detail || response.statusText,
          },
        };
      }

      return data;
    } catch (err: any) {
      return {
        success: false,
        error: {
          code: "NETWORK_ERROR",
          message: err.message || "Failed to communicate with BrandCanon backend",
        },
      };
    }
  }

  // --- Auth APIs ---
  public auth = {
    login: (payload: { email: string; password: string }) =>
      this.request<AuthResponseData>("/auth/login", {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    register: (payload: {
      email: string;
      password: string;
      full_name: string;
      organisation_name?: string;
    }) =>
      this.request<AuthResponseData>("/auth/register", {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    me: () => this.request<MeResponseData>("/auth/me", { method: "GET" }),

    logout: () => this.request<{ user_id: string }>("/auth/logout", { method: "POST" }),
  };

  // --- Organisation APIs ---
  public organisations = {
    getCurrent: () => this.request<OrganisationDetail>("/organisations/current", { method: "GET" }),

    updateCurrent: (payload: { name?: string; industry?: string; domain?: string }) =>
      this.request<OrganisationDetail>("/organisations/current", {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),

    updateSettings: (payload: {
      enforce_brand_voice?: boolean;
      strict_mode?: boolean;
      custom_metadata?: Record<string, any>;
    }) =>
      this.request<OrganisationSettings>("/organisations/current/settings", {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),

    create: (payload: { name: string; slug?: string; industry?: string; domain?: string }) =>
      this.request<OrganisationDetail>("/organisations", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  };

  // --- Member & Role APIs ---
  public members = {
    list: (page = 1, pageSize = 20) =>
      this.request<PaginatedResult<Member>>(`/members?page=${page}&page_size=${pageSize}`, {
        method: "GET",
      }),

    invite: (payload: {
      email: string;
      full_name: string;
      role: string;
      initial_password?: string;
    }) =>
      this.request<Member>("/members", {
        method: "POST",
        body: JSON.stringify(payload),
      }),

    updateRole: (memberId: string, role: string) =>
      this.request<Member>(`/members/${memberId}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role }),
      }),

    remove: (memberId: string) =>
      this.request<{ member_id: string }>(`/members/${memberId}`, {
        method: "DELETE",
      }),
  };

  // --- Audit APIs ---
  public audit = {
    list: (params: { page?: number; pageSize?: number; eventType?: string; entityType?: string } = {}) => {
      const q = new URLSearchParams();
      if (params.page) q.append("page", params.page.toString());
      if (params.pageSize) q.append("page_size", params.pageSize.toString());
      if (params.eventType) q.append("event_type", params.eventType);
      if (params.entityType) q.append("entity_type", params.entityType);
      return this.request<PaginatedResult<AuditLog>>(`/audit?${q.toString()}`, {
        method: "GET",
      });
    },
  };

  // --- Phase 2: Brand Knowledge Hub APIs ---
  public brand = {
    getOverview: () => this.request<KnowledgeOverviewStats>("/brand/overview", { method: "GET" }),

    // Profile
    getProfile: () => this.request<BrandProfile | null>("/brand/profile", { method: "GET" }),
    createProfile: (payload: Partial<BrandProfile>) =>
      this.request<BrandProfile>("/brand/profile", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    updateProfile: (payload: Partial<BrandProfile>) =>
      this.request<BrandProfile>("/brand/profile", {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),

    // Documents
    listDocuments: (params: { page?: number; pageSize?: number; processingStatus?: string; approvalStatus?: string } = {}) => {
      const q = new URLSearchParams();
      if (params.page) q.append("page", params.page.toString());
      if (params.pageSize) q.append("page_size", params.pageSize.toString());
      if (params.processingStatus) q.append("processing_status", params.processingStatus);
      if (params.approvalStatus) q.append("approval_status", params.approvalStatus);
      return this.request<PaginatedResult<BrandDocument>>(`/brand/documents?${q.toString()}`, {
        method: "GET",
      });
    },
    uploadDocument: (formData: FormData) =>
      this.request<BrandDocument>("/brand/documents", {
        method: "POST",
        body: formData,
      }),
    getDocument: (id: string) => this.request<BrandDocument>(`/brand/documents/${id}`, { method: "GET" }),
    getDocumentContent: (id: string) => this.request<DocumentContent>(`/brand/documents/${id}/content`, { method: "GET" }),
    reprocessDocument: (id: string) =>
      this.request<BrandDocument>(`/brand/documents/${id}/process`, { method: "POST" }),
    approveDocument: (id: string, reason?: string) =>
      this.request<BrandDocument>(`/brand/documents/${id}/approve`, {
        method: "POST",
        body: JSON.stringify({ decision: "APPROVED", reason }),
      }),
    rejectDocument: (id: string, reason?: string) =>
      this.request<BrandDocument>(`/brand/documents/${id}/reject`, {
        method: "POST",
        body: JSON.stringify({ decision: "REJECTED", reason }),
      }),
    archiveDocument: (id: string, reason?: string) =>
      this.request<BrandDocument>(`/brand/documents/${id}/archive`, {
        method: "POST",
        body: JSON.stringify({ decision: "ARCHIVED", reason }),
      }),
    deleteDocument: (id: string) =>
      this.request<{ document_id: string }>(`/brand/documents/${id}`, { method: "DELETE" }),

    // Facts
    listFacts: (params: { page?: number; pageSize?: number; status?: string; category?: string } = {}) => {
      const q = new URLSearchParams();
      if (params.page) q.append("page", params.page.toString());
      if (params.pageSize) q.append("page_size", params.pageSize.toString());
      if (params.status) q.append("status", params.status);
      if (params.category) q.append("category", params.category);
      return this.request<PaginatedResult<ApprovedFact>>(`/brand/facts?${q.toString()}`, {
        method: "GET",
      });
    },
    createFact: (payload: Partial<ApprovedFact>) =>
      this.request<ApprovedFact>("/brand/facts", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    getFact: (id: string) => this.request<ApprovedFact>(`/brand/facts/${id}`, { method: "GET" }),
    updateFact: (id: string, payload: Partial<ApprovedFact>) =>
      this.request<ApprovedFact>(`/brand/facts/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    approveFact: (id: string, reason?: string) =>
      this.request<ApprovedFact>(`/brand/facts/${id}/approve`, {
        method: "POST",
        body: JSON.stringify({ decision: "APPROVED", reason }),
      }),
    rejectFact: (id: string, reason?: string) =>
      this.request<ApprovedFact>(`/brand/facts/${id}/reject`, {
        method: "POST",
        body: JSON.stringify({ decision: "REJECTED", reason }),
      }),
    archiveFact: (id: string, reason?: string) =>
      this.request<ApprovedFact>(`/brand/facts/${id}/archive`, {
        method: "POST",
        body: JSON.stringify({ decision: "ARCHIVED", reason }),
      }),
    deleteFact: (id: string) =>
      this.request<{ fact_id: string }>(`/brand/facts/${id}`, { method: "DELETE" }),

    // Terminology
    listTerminology: (params: { page?: number; pageSize?: number; status?: string; category?: string; severity?: string } = {}) => {
      const q = new URLSearchParams();
      if (params.page) q.append("page", params.page.toString());
      if (params.pageSize) q.append("page_size", params.pageSize.toString());
      if (params.status) q.append("status", params.status);
      if (params.category) q.append("category", params.category);
      if (params.severity) q.append("severity", params.severity);
      return this.request<PaginatedResult<TerminologyRule>>(`/brand/terminology?${q.toString()}`, {
        method: "GET",
      });
    },
    createTerminology: (payload: Partial<TerminologyRule>) =>
      this.request<TerminologyRule>("/brand/terminology", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    getTerminology: (id: string) => this.request<TerminologyRule>(`/brand/terminology/${id}`, { method: "GET" }),
    updateTerminology: (id: string, payload: Partial<TerminologyRule>) =>
      this.request<TerminologyRule>(`/brand/terminology/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    approveTerminology: (id: string, reason?: string) =>
      this.request<TerminologyRule>(`/brand/terminology/${id}/approve`, {
        method: "POST",
        body: JSON.stringify({ decision: "APPROVED", reason }),
      }),
    rejectTerminology: (id: string, reason?: string) =>
      this.request<TerminologyRule>(`/brand/terminology/${id}/reject`, {
        method: "POST",
        body: JSON.stringify({ decision: "REJECTED", reason }),
      }),
    archiveTerminology: (id: string, reason?: string) =>
      this.request<TerminologyRule>(`/brand/terminology/${id}/archive`, {
        method: "POST",
        body: JSON.stringify({ decision: "ARCHIVED", reason }),
      }),
    deleteTerminology: (id: string) =>
      this.request<{ rule_id: string }>(`/brand/terminology/${id}`, { method: "DELETE" }),
    checkTerminology: (text: string) =>
      this.request<TerminologyMatch[]>("/brand/terminology/check", {
        method: "POST",
        body: JSON.stringify({ text }),
      }),

    // Approvals History
    listApprovals: (params: { page?: number; pageSize?: number; entityType?: string; decision?: string } = {}) => {
      const q = new URLSearchParams();
      if (params.page) q.append("page", params.page.toString());
      if (params.pageSize) q.append("page_size", params.pageSize.toString());
      if (params.entityType) q.append("entity_type", params.entityType);
      if (params.decision) q.append("decision", params.decision);
      return this.request<PaginatedResult<KnowledgeApproval>>(`/brand/approvals?${q.toString()}`, {
        method: "GET",
      });
    },
  };
}

export const api = new ApiClient();
