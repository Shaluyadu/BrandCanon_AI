import sys
import os

# Add parent directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from app.core.database import SessionLocal, Base, engine
from app.core.security import hash_password
from app.models.organisation import Organisation, OrganisationSettings
from app.models.user import User, Membership, RoleEnum
from app.models.audit import AuditLog

DEFAULT_PASSWORD = "NovaTech@2026!"


def seed_database():
    """Seed the initial NovaTech organization and role accounts for demonstration."""
    print("Initializing database schema...")
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if NovaTech already exists
        existing_org = db.query(Organisation).filter(Organisation.slug == "novatech").first()
        if existing_org:
            print("NovaTech organization is already seeded.")
            return

        print("Seeding NovaTech organization...")
        org = Organisation(
            name="NovaTech Solutions",
            slug="novatech",
            industry="Enterprise Technology & Cloud AI",
            domain="novatech.io",
            is_active=True
        )
        db.add(org)
        db.flush()

        settings = OrganisationSettings(
            organisation_id=org.id,
            enforce_brand_voice=True,
            strict_mode=False,
            custom_metadata={
                "tagline": "Next-Gen Enterprise Infrastructure",
                "founded_year": 2021
            }
        )
        db.add(settings)
        db.flush()

        # Seed Users for all 4 RBAC Roles with Argon2id hash
        users_data = [
            {
                "email": "admin@novatech.io",
                "full_name": "NovaTech Workspace Admin",
                "role": RoleEnum.ADMIN.value
            },
            {
                "email": "brand@novatech.io",
                "full_name": "Sarah Chen (Brand Manager)",
                "role": RoleEnum.BRAND_MANAGER.value
            },
            {
                "email": "creator@novatech.io",
                "full_name": "Alex Rivera (Content Creator)",
                "role": RoleEnum.CREATOR.value
            },
            {
                "email": "reviewer@novatech.io",
                "full_name": "Marcus Vance (Compliance Reviewer)",
                "role": RoleEnum.REVIEWER.value
            }
        ]

        hashed_pwd = hash_password(DEFAULT_PASSWORD)

        for u_data in users_data:
            user = User(
                email=u_data["email"],
                hashed_password=hashed_pwd,
                full_name=u_data["full_name"],
                is_active=True,
                # Admin and seeded demo accounts are verified for convenience
                is_verified=True
            )
            db.add(user)
            db.flush()

            membership = Membership(
                organisation_id=org.id,
                user_id=user.id,
                role=u_data["role"],
                is_default=True
            )
            db.add(membership)
            db.flush()

            audit = AuditLog(
                organisation_id=org.id,
                user_id=user.id,
                event_type="USER_SEEDED",
                entity_type="USER",
                entity_id=user.id,
                metadata_json={"email": user.email, "role": u_data["role"]}
            )
            db.add(audit)

        db.commit()
        print("NovaTech organization and users seeded successfully with Argon2id:")
        for u in users_data:
            print(f"  - {u['role']:<15}: {u['email']} (Password: {DEFAULT_PASSWORD})")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()


if __name__ == "__main__":
    seed_database()
