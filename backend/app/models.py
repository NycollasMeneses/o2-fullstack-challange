
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.database import Base, engine
from app import models
from datetime import datetime

Base.metadata.create_all(bind=engine)
class Produto(Base):
    __tablename__ = "produtos"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String)
    descricao = Column(String)
    codigo = Column(String)
    quantidade = Column(Integer)
    preco = Column(Float)
    categoria = Column(String)

class Movement(Base):
    __tablename__ = "movemento"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("produtos.id"))
    quantity = Column(Integer)
    type = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)

    product = relationship("Produto")
