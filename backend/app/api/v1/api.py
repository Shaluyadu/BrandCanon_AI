from fastapi import APIRouter
from app.api.v1 import auth, organisations, members, audit

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication & Profile"])
api_router.include_router(organisations.router, prefix="/organisations", tags=["Organisations & Workspace"])
api_router.include_router(members.router, prefix="/members", tags=["Members & Roles"])
api_router.include_router(audit.router, prefix="/audit", tags=["Audit Trails"])

