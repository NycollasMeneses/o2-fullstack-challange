# init_db.py
from app.database import Base, engine
from app import models

print("Criando tabelas no PostgreSQL...")
Base.metadata.create_all(bind=engine)
print("Tabelas criadas com sucesso.")
