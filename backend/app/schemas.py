from pydantic import BaseModel
from datetime import datetime

class ProductBase(BaseModel):
    nome: str
    descricao: str
    codigo: str
    quantidade: int
    preco: float
    categoria: str

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int

    class Config:
        orm_mode = True

class MovementCreate(BaseModel):
    product_id: int
    quantity: int
    type: str  # entrada ou saida

class Movement(MovementCreate):
    id: int
    timestamp: datetime

    class Config:
        orm_mode = True