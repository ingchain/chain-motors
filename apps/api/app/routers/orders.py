from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.database import get_db
from app.core.roles import get_current_user
from app.schemas.order import OrderCreate


router = APIRouter(prefix="/orders", tags=["orders"])


@router.get("/me")
async def my_orders(user: dict = Depends(get_current_user)) -> list[dict]:
    db = get_db()
    orders = await db.orders.find({"user_id": user["_id"]}).sort("created_at", -1).to_list(length=200)
    for order in orders:
        order["id"] = str(order.pop("_id"))
    return orders


@router.post("")
async def create_order(payload: OrderCreate, user: dict = Depends(get_current_user)) -> dict:
    if not payload.items:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Order requires items")

    now = datetime.now(timezone.utc)
    total = sum(item.qty * item.price for item in payload.items)
    doc = {
        "user_id": user["_id"],
        "items": [item.model_dump() for item in payload.items],
        "total": total,
        "status": "pending",
        "created_at": now,
        "updated_at": now,
    }

    db = get_db()
    result = await db.orders.insert_one(doc)
    return {"id": str(result.inserted_id), "status": "pending"}
