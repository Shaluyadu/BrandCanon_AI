# BrandCanon AI — Enterprise-Ready Intelligent Brand Governance SaaS

> **BrandCanon AI** is an intelligent pre-publication assurance and content compliance SaaS platform. It serves as an evidence-grounded brand governance engine for marketing teams, content creators, brand managers, and legal reviewers.

---

## 🚀 Phase 1 Foundation: Implemented & Verified

### 1. Multi-Tenant Workspace & Security Isolation
- **Tenant Scoping**: All queries, ORM relationships, services, and APIs are scoped to an authenticated organization workspace (`X-Organisation-Id` header resolution).
- **Zero Cross-Tenant Leakage**: Tested and verified that users belonging to Organization A cannot access Organization B's workspace or members (enforces `403 FORBIDDEN: TENANT_ACCESS_FORBIDDEN`).
- **Cryptographic Security**: PBKDF2-HMAC-SHA256 password hashing with salt, constant-time comparison, and RFC 7519 HS256 JWT sessions.

### 2. Role-Based Access Control (RBAC)
Enforces a 4-tier enterprise role matrix across backend API dependencies and frontend UI:
1. **Workspace Admin**: Full authority over workspace settings, inviting members, role assignment, and audit logs.
2. **Brand Owner / Brand Manager**: Authority over brand guidelines, verified claims, terminology rules, and human knowledge approvals.
3. **Content Creator**: Authority over permitted submissions, running reviews, and accepting/dismissing suggestions.
4. **Reviewer (Legal / Compliance)**: Authority over review queue, evaluating evidence, and recording final approval or rejection decisions.

### 3. Responsive Next.js Enterprise Design System
- Built with **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Lucide icons**.
- Clean, light-first enterprise design with restrained orange identity accent (`#EA580C`), dark navy typography (`#0F172A`), and clear status indicators.
- **Role-aware collapsible navigation**: Dynamically surfaces permitted tools per role.
- **Dynamic Quick-Login selector**: Pre-configured for NovaTech demonstration personas.

### 4. Database Architecture & Migrations
- **SQLAlchemy 2.0** ORM models: `organisations`, `organisation_settings`, `users`, `memberships`, `user_sessions`, `audit_logs`.
- **Alembic** migration pipeline initialized and verified (`001_initial_auth_and_org.py`).
- Supports **PostgreSQL with pgvector** for production and **SQLite** for zero-dependency local development and CI testing.

---

## 👥 Fictional Demonstration Accounts (NovaTech)

Pre-seeded into the database for immediate testing:

| Role | Email | Password | Primary Authority |
| :--- | :--- | :--- | :--- |
| **Workspace Admin** | `admin@novatech.io` | `NovaTech@2026!` | Workspace configuration, member roles, audit logs |
| **Brand Manager** | `brand@novatech.io` | `NovaTech@2026!` | Brand guidelines, approved facts, terminology |
| **Content Creator** | `creator@novatech.io` | `NovaTech@2026!` | Content drafting & pre-publication reviews |
| **Reviewer / Legal** | `reviewer@novatech.io` | `NovaTech@2026!` | Review queue, approving or rejecting submissions |

---

## 🛠️ Local Development & Execution Commands

### Prerequisites
- Node.js 18+ (tested with Node v26)
- Python 3.10+ (tested with Python 3.14)

### 1. Backend Setup & Run

```bash
cd backend

# (Optional) Activate your Python virtual environment
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run initial database migration & seed NovaTech demo accounts
alembic upgrade head
python3 seed.py

# Start the FastAPI development server (runs on port 8000)
python3 -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

- API Base URL: `http://127.0.0.1:8000`
- Interactive OpenAPI Docs: `http://127.0.0.1:8000/docs`
- ReDoc Documentation: `http://127.0.0.1:8000/redoc`

### 2. Frontend Setup & Run

```bash
cd frontend

# Install dependencies (already installed)
npm install

# Run the development server (runs on port 3000)
npm run dev

# Or build and test the production bundle
npm run build
npm start
```

- Web Application: `http://localhost:3000`

### 3. Running Automated Tests

```bash
# Run backend pytest suite (14 test cases, 100% pass)
cd backend
python3 -m pytest -v

# Run frontend TypeScript type checking
cd frontend
npm run typecheck
```

---

## 🚢 Docker Compose Production Setup

To run the complete production stack (PostgreSQL + pgvector, Redis, FastAPI Backend, and Next.js Frontend):

```bash
docker compose up --build
```

---

## 📋 Status Overview: Phase 1 Complete vs Pending

| Module / Milestone | Status | Description |
| :--- | :---: | :--- |
| **Phase 1: Foundation & RBAC** | ✅ Complete | Multi-tenant auth, workspace onboarding, RBAC, DB migrations, 14 passing tests, Next.js build. |
| **Phase 2: Brand Knowledge Hub** | ⏳ Pending | Guidelines ingestion (DOCX/PDF), claim extraction, terminology rules, manager approval. |
| **Phase 3: Content Submissions** | ⏳ Pending | Submission form, DOCX parsing, versioning, background job queuing. |
| **Phase 4: Agentic AI Review** | ⏳ Pending | Review orchestrator, deterministic rules, pgvector RAG, evidence validation layer. |
| **Phase 5: Governance & Approvals** | ⏳ Pending | Split-screen Review Studio, creator revisions, reviewer decision queue. |
| **Phase 6: Governance Analytics** | ⏳ Pending | Empirical compliance metrics, recurring violation patterns, performance benchmarks. |
| **Phase 7: Deployment Hardening** | ⏳ Pending | Production cloud deployment, object storage bucket, TLS, monitoring. |

# BrandCanon_AI
