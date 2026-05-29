from pathlib import Path

from fastapi.testclient import TestClient
from openpyxl import Workbook

from app.main import app


client = TestClient(app)


def test_health() -> None:
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "finlens-api"}


def test_create_upload_session_returns_mock_signed_url() -> None:
    response = client.post(
        "/uploads/sessions",
        json={
            "organisation_id": "org_123",
            "file_name": "trial_balance.xlsx",
            "content_type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
    )

    assert response.status_code == 200
    assert response.json()["upload_id"] == "upl_org_123_trial_balance_xlsx"
    assert response.json()["expires_in_seconds"] == 900


def test_blueprint_validation_rejects_forbidden_identity_markers() -> None:
    response = client.post(
        "/llm/blueprints/validate",
        json={
            "workspace_id": "manufacturing",
            "masked_kpis": [{"metric": "DSO", "note": "customer name surfaced"}],
        },
    )

    assert response.status_code == 200
    assert response.json()["valid"] is False
    assert response.json()["privacy_boundary"] == "masked-kpi-blueprint"


def test_inspect_workbook_returns_sheet_metadata(tmp_path: Path) -> None:
    workbook_path = tmp_path / "sample.xlsx"
    workbook = Workbook()
    sheet = workbook.active
    sheet.title = "PnL"
    sheet.append(["Account", "Amount"])
    sheet.append(["Revenue", 125000])
    sheet.append(["COGS", 72000])
    workbook.save(workbook_path)

    response = client.post("/workbooks/inspect", json={"file_path": str(workbook_path)})

    assert response.status_code == 200
    payload = response.json()
    assert payload["file_name"] == "sample.xlsx"
    assert payload["sheets"][0]["name"] == "PnL"
    assert payload["sheets"][0]["rows"] == 2
    assert payload["sheets"][0]["headers"] == ["Account", "Amount"]
    assert payload["sheets"][0]["preview"][0] == {"Account": "Revenue", "Amount": 125000}
