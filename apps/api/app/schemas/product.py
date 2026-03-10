from pydantic import BaseModel, Field


class ProductBase(BaseModel):
    name: str = Field(min_length=2)
    slug: str = Field(min_length=2)
    category: str
    price: float = Field(ge=0)
    stock: int = Field(ge=0)
    description: str = ""
    images: list[str] = []
    is_active: bool = True


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    name: str | None = None
    category: str | None = None
    price: float | None = Field(default=None, ge=0)
    stock: int | None = Field(default=None, ge=0)
    description: str | None = None
    images: list[str] | None = None
    is_active: bool | None = None


class ProductOut(ProductBase):
    id: str
