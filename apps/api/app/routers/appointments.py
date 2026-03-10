from datetime import datetime, timezone

from fastapi import APIRouter, Depends

from app.core.database import get_db
from app.core.roles import get_current_user
from app.schemas.appointment import AppointmentCreate


router = APIRouter(prefix="/appointments", tags=["appointments"])


@router.get("/me")
async def my_appointments(user: dict = Depends(get_current_user)) -> list[dict]:
    db = get_db()
    appointments = (
        await db.service_appointments.find({"user_id": user["_id"]})
        .sort("created_at", -1)
        .to_list(length=200)
    )
    for appointment in appointments:
        appointment["id"] = str(appointment.pop("_id"))
    return appointments


@router.post("")
async def create_appointment(payload: AppointmentCreate, user: dict = Depends(get_current_user)) -> dict:
    now = datetime.now(timezone.utc)
    doc = {
        "user_id": user["_id"],
        "service_type": payload.service_type,
        "scheduled_at": payload.scheduled_at,
        "status": "scheduled",
        "notes": payload.notes,
        "created_at": now,
        "updated_at": now,
    }

    db = get_db()
    result = await db.service_appointments.insert_one(doc)
    return {"id": str(result.inserted_id), "status": "scheduled"}
