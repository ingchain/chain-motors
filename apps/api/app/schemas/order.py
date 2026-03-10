from datetime import datetime

from pydantic import BaseModel, Field


class OrderItem(BaseModel):
    product_id: str
    name: str
    qty: int = Field(ge=1)
    price: float = Field(ge=0)


class OrderCreate(BaseModel):
    items: list[OrderItem]


class OrderOut(BaseModel):
    id: str
    user_id: str
    items: list[OrderItem]
    total: float
    status: str
    created_at: datetime
    updated_at: datetime
