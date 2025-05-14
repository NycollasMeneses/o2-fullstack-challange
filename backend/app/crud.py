from sqlalchemy.orm import Session
from app import models, schemas

def get_movements(db, skip=0, limit=100):
    return db.query(models.Movement).offset(skip).limit(limit).all()

def create_movement(db, movement: schemas.MovementCreate):
    db_movement = models.Movement(**movement.dict())

    # Atualiza quantidade do produto
    produto = db.query(models.Produto).filter(models.Produto.id == movement.product_id).first()
    if produto:
        if movement.type == "entrada":
            produto.quantidade += movement.quantity
        elif movement.type == "saida":
            produto.quantidade -= movement.quantity

    db.add(db_movement)
    db.commit()
    db.refresh(db_movement)
    return db_movement 

def get_products(db: Session):
    return db.query(models.Produto).all()

def create_product(db: Session, product: schemas.ProductCreate):
    db_product = models.Produto(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def update_product(db: Session, product_id: int, product: schemas.ProductCreate):
    db_product = db.query(models.Produto).filter_by(id=product_id).first()
    if db_product:
        for key, value in product.dict().items():
            setattr(db_product, key, value)
        db.commit()
        db.refresh(db_product)
    return db_product

def delete_product(db: Session, product_id: int):
    db_product = db.query(models.Produto).filter_by(id=product_id).first()
    if db_product:
        db.delete(db_product)
        db.commit()
    return {"ok": True}