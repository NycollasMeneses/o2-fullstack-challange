
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import crud, schemas, database

router = APIRouter()

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=list[schemas.Movement])
def read_movements(db: Session = Depends(get_db)):
    return crud.get_movements(db)

@router.post("/", response_model=schemas.Movement)
def add_movement(movement: schemas.MovementCreate, db: Session = Depends(get_db)):
    return crud.create_movement(db, movement)
