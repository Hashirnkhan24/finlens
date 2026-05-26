from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI(
    title="FinLens Processing API",
    version="0.1.0",
    description="Deterministic parsing, validation, ratio, lineage, and AI-blueprint service."
)


class UploadSession(BaseModel):
    organisation_id: str
    file_name: str
    content_type: str
    document_type_hint: str | None = None


class UploadSessionResponse(BaseModel):
    upload_id: str
    signed_url: str
    expires_in_seconds: int = 900


class InsightBlueprint(BaseModel):
    workspace_id: str
    privacy_boundary: str = "masked-kpi-blueprint"
    masked_kpis: list[dict] = Field(default_factory=list)
    never_included: list[str] = Field(
        default_factory=lambda: [
            "raw rupee transaction rows",
            "customer or vendor legal names",
            "payroll identities",
            "bank account numbers",
            "uploaded file contents",
        ]
    )


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "service": "finlens-api"}


@app.post("/uploads/sessions")
def create_upload_session(payload: UploadSession) -> UploadSessionResponse:
    return UploadSessionResponse(
        upload_id=f"upl_{payload.organisation_id}_{payload.file_name.replace('.', '_')}",
        signed_url="http://localhost:3000/api/mock-signed-upload-url",
    )


@app.post("/llm/blueprints/validate")
def validate_blueprint(payload: InsightBlueprint) -> dict[str, object]:
    forbidden_markers = ["invoice row", "customer name", "vendor name", "salary", "bank account"]
    serialized = payload.model_dump_json().lower()

    return {
        "valid": not any(marker in serialized for marker in forbidden_markers),
        "privacy_boundary": payload.privacy_boundary,
        "checked_markers": forbidden_markers,
    }
