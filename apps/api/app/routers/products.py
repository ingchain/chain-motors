from fastapi import APIRouter, Query

from app.core.database import get_db


router = APIRouter(prefix="/products", tags=["products"])


@router.get("")
async def list_products(
    search: str = "",
    category: str = "",
    page: int = Query(default=1, ge=1),
    limit: int = Query(default=12, ge=1, le=100),
) -> dict:
    db = get_db()
    filters: dict = {"is_active": True}

    if category:
        filters["category"] = category

    if search:
        filters["name"] = {"$regex": search, "$options": "i"}

    skip = (page - 1) * limit
    cursor = db.products.find(filters).sort("created_at", -1).skip(skip).limit(limit)
    products = await cursor.to_list(length=limit)
    total = await db.products.count_documents(filters)

    for p in products:
        p["id"] = str(p.pop("_id"))

    return {
        "items": products,
        "total": total,
        "page": page,
        "limit": limit,
    }
