from fastapi import FastAPI, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from transformers import pipeline
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, ForeignKey, func, extract
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from app.routes import products, movements
import re
from app.database import Base, engine
from app import models
from datetime import datetime

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SQLALCHEMY_DATABASE_URL = "postgresql://meu_usuario:minhasenha@localhost:5432/estoque"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

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
    type = Column(String)  # entrada ou saída
    timestamp = Column(DateTime, default=datetime.utcnow)
    product = relationship("Produto")

Base.metadata.create_all(bind=engine)

app.include_router(products.router, prefix="/products", tags=["products"])
app.include_router(movements.router, prefix="/movements", tags=["movements"])

generator = pipeline("text2text-generation", model="google/flan-t5-base")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/ask")
async def ask(req: Request, db: Session = Depends(get_db)):
    try:
        body = await req.json()
        user_prompt = body.get("prompt", "").strip()

        if not user_prompt:
            return {"error": "Prompt vazio."}

        prompt_lower = user_prompt.lower()

        if "estoque abaixo de" in prompt_lower:
            match = re.search(r"abaixo de (\d+)", prompt_lower)
            if match:
                limite = int(match.group(1))
                produtos = db.query(Produto).filter(Produto.quantidade < limite).all()
                nomes = [f"{p.nome} ({p.quantidade})" for p in produtos]
                return {"response": "Produtos com estoque abaixo de {}: {}".format(limite, ", ".join(nomes) or "nenhum")}

        elif any(kw in prompt_lower for kw in ["total de itens", "quantidade total", "quantos produtos", "quantidade em estoque"]):
            total = db.query(Produto).with_entities(func.sum(Produto.quantidade)).scalar() or 0
            return {"response": f"O total de itens em estoque é {total}."}

        elif any(kw in prompt_lower for kw in ["valor total em estoque", "quanto vale", "soma dos valores", "preço total"]):
            total = db.query(Produto).with_entities(func.sum(Produto.quantidade * Produto.preco)).scalar() or 0.0
            return {"response": f"O valor total em estoque é R$ {total:.2f}."}

        elif any(kw in prompt_lower for kw in ["produto mais barato", "mais barato", "menor preço"]):
            produto = db.query(Produto).order_by(Produto.preco.asc()).first()
            if produto:
                return {"response": f"O produto mais barato é '{produto.nome}' custando R$ {produto.preco:.2f}."}
            else:
                return {"response": "Não há produtos cadastrados."}

        elif any(kw in prompt_lower for kw in ["listar produtos", "quais produtos", "produtos no estoque", "mostrar produtos"]):
            produtos = db.query(Produto).all()
            nomes = [f"{p.nome} ({p.quantidade})" for p in produtos]
            return {"response": "Produtos disponíveis: " + (", ".join(nomes) or "nenhum produto cadastrado")}

        elif any(kw in prompt_lower for kw in ["movimentações", "histórico de movimentações", "movimentos do estoque", "registro de entradas e saídas"]):
            movimentos = db.query(Movement).order_by(Movement.timestamp.desc()).limit(10).all()
            if movimentos:
                texto = []
                for m in movimentos:
                    texto.append(f"{m.timestamp.strftime('%d/%m/%Y %H:%M')} - {m.product.nome} - {m.type} de {m.quantity}")
                return {"response": "Últimas movimentações:\n" + "\n".join(texto)}
            else:
                return {"response": "Nenhuma movimentação registrada."}

        elif "vendas no mês" in prompt_lower or "vendas do mês" in prompt_lower:
            now = datetime.utcnow()
            total = db.query(func.sum(Movement.quantity)).filter(
                Movement.type == "saida",
                extract("month", Movement.timestamp) == now.month,
                extract("year", Movement.timestamp) == now.year
            ).scalar() or 0
            return {"response": f"O total de itens vendidos neste mês é {total}."}

        elif match := re.search(r"vendas em (\w+) de (\d{4})", prompt_lower):
            meses = {
                "janeiro": 1, "fevereiro": 2, "março": 3, "abril": 4, "maio": 5,
                "junho": 6, "julho": 7, "agosto": 8, "setembro": 9, "outubro": 10,
                "novembro": 11, "dezembro": 12
            }
            mes_nome = match.group(1)
            ano = int(match.group(2))
            mes = meses.get(mes_nome)
            if mes:
                total = db.query(func.sum(Movement.quantity)).filter(
                    Movement.type == "saida",
                    extract("month", Movement.timestamp) == mes,
                    extract("year", Movement.timestamp) == ano
                ).scalar() or 0
                return {"response": f"O total de itens vendidos em {mes_nome} de {ano} foi {total}."}
            else:
                return {"response": f"Não foi possível entender o mês '{mes_nome}'."}

        elif match := re.search(r"entradas em (\w+) de (\d{4})", prompt_lower):
            meses = {
                "janeiro": 1, "fevereiro": 2, "março": 3, "abril": 4, "maio": 5,
                "junho": 6, "julho": 7, "agosto": 8, "setembro": 9, "outubro": 10,
                "novembro": 11, "dezembro": 12
            }
            mes_nome = match.group(1)
            ano = int(match.group(2))
            mes = meses.get(mes_nome)
            if mes:
                total = db.query(func.sum(Movement.quantity)).filter(
                    Movement.type == "entrada",
                    extract("month", Movement.timestamp) == mes,
                    extract("year", Movement.timestamp) == ano
                ).scalar() or 0
                return {"response": f"O total de entradas em {mes_nome} de {ano} foi {total}."}
            else:
                return {"response": f"Não foi possível entender o mês '{mes_nome}'."}
            
        elif match := re.search(r"relat[óo]rio de (\w+) de (\d{4})", prompt_lower):
                meses = {
                    "janeiro": 1, "fevereiro": 2, "março": 3, "abril": 4, "maio": 5,
                    "junho": 6, "julho": 7, "agosto": 8, "setembro": 9, "outubro": 10,
                    "novembro": 11, "dezembro": 12
                }
                mes_nome = match.group(1)
                ano = int(match.group(2))
                mes = meses.get(mes_nome)
                if mes:
                    entradas = db.query(func.sum(Movement.quantity)).filter(
                        Movement.type == "entrada",
                        extract("month", Movement.timestamp) == mes,
                        extract("year", Movement.timestamp) == ano
                    ).scalar() or 0
                    saidas = db.query(func.sum(Movement.quantity)).filter(
                        Movement.type == "saida",
                        extract("month", Movement.timestamp) == mes,
                        extract("year", Movement.timestamp) == ano
                    ).scalar() or 0
                    saldo = entradas - saidas
                    return {
                        "response": f"📊 Relatório de {mes_nome} de {ano}:\n"
                                    f"Entradas: {entradas}\n"
                                    f"Saídas: {saidas}\n"
                                    f"Saldo: {saldo}"
                    }
                else:
                    return {"response": f"Não foi possível entender o mês '{mes_nome}'."}

        result = generator(user_prompt, max_length=100)[0]['generated_text']
        return {"response": result}

    except Exception as e:
        return {"error": f"Erro ao gerar resposta: {str(e)}"}
