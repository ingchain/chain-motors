from datetime import datetime, timezone

from fastapi import APIRouter, Cookie, Depends, HTTPException, Response, status
from pydantic import EmailStr

from app.core.config import settings
from app.core.database import get_db
from app.core.roles import get_current_user
from app.core.security import (
    create_access_token,
    create_refresh_token,
    decode_refresh_token,
    hash_password,
    verify_password,
)
from app.schemas.auth import LoginIn, RegisterIn, TokenOut


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=TokenOut)
async def register(payload: RegisterIn, response: Response) -> TokenOut:
    db = get_db()
    existing = await db.users.find_one({"email": payload.email})
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    user_doc = {
        "_id": payload.email,
        "name": payload.name,
        "email": payload.email,
        "password_hash": hash_password(payload.password),
        "role": "client",
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc),
    }
    await db.users.insert_one(user_doc)

    access_token = create_access_token(subject=user_doc["_id"], role=user_doc["role"])
    refresh_token = create_refresh_token(subject=user_doc["_id"])
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=settings.refresh_token_days * 24 * 60 * 60,
    )

    return TokenOut(
        access_token=access_token,
        role=user_doc["role"],
        name=user_doc["name"],
        email=EmailStr(user_doc["email"]),
    )


@router.post("/login", response_model=TokenOut)
async def login(payload: LoginIn, response: Response) -> TokenOut:
    db = get_db()
    user = await db.users.find_one({"email": payload.email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    access_token = create_access_token(subject=user["_id"], role=user["role"])
    refresh_token = create_refresh_token(subject=user["_id"])
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=True,
        samesite="lax",
        max_age=settings.refresh_token_days * 24 * 60 * 60,
    )

    return TokenOut(
        access_token=access_token,
        role=user["role"],
        name=user["name"],
        email=EmailStr(user["email"]),
    )


@router.post("/refresh", response_model=TokenOut)
async def refresh_token(refresh_token: str | None = Cookie(default=None)) -> TokenOut:
    if not refresh_token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing refresh token")

    payload = decode_refresh_token(refresh_token)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")

    db = get_db()
    user = await db.users.find_one({"_id": payload["sub"]})
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    access_token = create_access_token(subject=user["_id"], role=user["role"])
    return TokenOut(
        access_token=access_token,
        role=user["role"],
        name=user["name"],
        email=EmailStr(user["email"]),
    )


@router.post("/logout")
async def logout(response: Response) -> dict[str, str]:
    response.delete_cookie("refresh_token")
    return {"message": "Logged out"}


@router.get("/me")
async def me(user: dict = Depends(get_current_user)) -> dict:
    return {
        "name": user["name"],
        "email": user["email"],
        "role": user["role"],
    }
