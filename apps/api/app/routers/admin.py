from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect, status

from app.core.database import get_db
from app.core.roles import require_role
from app.schemas.product import ProductCreate, ProductUpdate
from app.services.realtime import ws_manager


router = APIRouter(prefix="/admin", tags=["admin"])


@router.get("/products")
async def admin_list_products(_: dict = Depends(require_role("admin"))) -> list[dict]:
    db = get_db()
    products = await db.products.find({}).sort("created_at", -1).to_list(length=500)
    for product in products:
        product["id"] = str(product.pop("_id"))
    return products


@router.get("/orders")
async def admin_list_orders(_: dict = Depends(require_role("admin"))) -> list[dict]:
    db = get_db()
    orders = await db.orders.find({}).sort("created_at", -1).to_list(length=500)
    for order in orders:
        order["id"] = str(order.pop("_id"))
    return orders


@router.post("/products")
async def admin_create_product(payload: ProductCreate, _: dict = Depends(require_role("admin"))) -> dict:
    now = datetime.now(timezone.utc)
    doc = payload.model_dump()
    doc["created_at"] = now
    doc["updated_at"] = now

    db = get_db()
    exists = await db.products.find_one({"slug": payload.slug})
    if exists:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Slug already exists")

    result = await db.products.insert_one(doc)
    return {"id": str(result.inserted_id)}


@router.put("/products/{product_id}")
async def admin_update_product(
    product_id: str,
    payload: ProductUpdate,
    _: dict = Depends(require_role("admin")),
) -> dict:
    db = get_db()
    update_data = {k: v for k, v in payload.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.now(timezone.utc)
    result = await db.products.update_one({"_id": ObjectId(product_id)}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return {"updated": True}


@router.delete("/products/{product_id}")
async def admin_delete_product(product_id: str, _: dict = Depends(require_role("admin"))) -> dict:
    db = get_db()
    result = await db.products.delete_one({"_id": ObjectId(product_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return {"deleted": True}


@router.patch("/orders/{order_id}/status")
async def admin_update_order_status(order_id: str, status_value: str, _: dict = Depends(require_role("admin"))) -> dict:
    db = get_db()
    now = datetime.now(timezone.utc)
    result = await db.orders.update_one(
        {"_id": ObjectId(order_id)},
        {"$set": {"status": status_value, "updated_at": now}},
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

    await ws_manager.broadcast_json({"order_id": order_id, "status": status_value, "updated_at": now.isoformat()})
    return {"updated": True}


@router.websocket("/ws/orders")
async def orders_ws(websocket: WebSocket) -> None:
    await ws_manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
