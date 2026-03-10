from datetime import datetime

from pydantic import BaseModel


class AppointmentCreate(BaseModel):
    service_type: str
    scheduled_at: datetime
    notes: str = ""


class AppointmentOut(BaseModel):
    id: str
    user_id: str
    service_type: str
    scheduled_at: datetime
    status: str
    notes: str
    created_at: datetime
    updated_at: datetime
