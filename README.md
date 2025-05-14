# Sistema de Gestão de Estoque

Este projeto é uma aplicação completa de gestão de estoque, com cadastro de produtos, movimentações de entrada e saída, relatórios visuais, e um agente de IA capaz de responder a comandos em linguagem natural.

## 🚀 Tecnologias Utilizadas

* **Front-end:** React + TailwindCSS
* **Back-end:** FastAPI (Python)
* **Banco de Dados:** PostgreSQL
* **IA:** Transformers (Google Flan-T5)

---

## ⚙️ Instalação e Execução

### 1. Clone o repositório

```bash
git clone [https://github.com/NycollasMeneses/o2-fullstack-challange]
cd estoque-app
```

### 2. Configuração do Banco (PostgreSQL)

Crie o banco e o usuário:

```sql
CREATE DATABASE estoque;
CREATE USER meu_usuario WITH PASSWORD 'minhasenha';
GRANT ALL PRIVILEGES ON DATABASE estoque TO meu_usuario;
```

### 3. Back-end (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate # Linux/macOS
venv\Scripts\activate   # Windows
pip install -r requirements.txt
```

Crie o arquivo `.env` com a string de conexão e key do hugging face:

```
HF_API_TOKEN = 
DATABASE_URL=postgresql://meu_usuario:minhasenha@localhost:5432/estoque  #substitua pela sua string de conexão
```

Inicie o servidor:

```bash
uvicorn main:app --reload
```

### 4. Front-end (React)

```bash
cd frontend
npm install
npm run dev
```

---

## 🌐 Funcionalidades

### Produtos

* Cadastro com nome, descrição, código, quantidade, preço, categoria
* Edição, remoção e busca por nome/código/categoria
* Interface em formato "wizard"

### Movimentações de Estoque

* Registro de **entradas** e **saídas**
* Data e quantidade registrada automaticamente

### Dashboard

* Gráfico de vendas por mês (com filtro por ano)
* Valor total em estoque
* Produtos mais vendidos
* Distribuição por categoria

### Agente de IA (via `/ask`)

* Responde a comandos como:

  * "Mostrar vendas em abril"
  * "Qual o valor total em estoque?"
  * "Quais produtos estão abaixo de 10 unidades?"
  * "Cadastrar saída de 5 unidades do produto notebook"

---

## 🔍 Exemplos de Uso do Agente de IA

```bash
POST /ask
{
  "prompt": "Mostrar vendas em janeiro"
}
```

**Resposta:**

```json
{
  "response": "Foram vendidas 13 unidades em janeiro."
}
```

---

## 📄 Desafio

Este projeto foi implementado como solução para o desafio de Sistema de Gestão de Estoque.

---

## ✅ Check Final

* [x] Cadastro de produtos
* [x] Movimentações de entrada/saída
* [x] Dashboard com relatórios visuais
* [x] IA funcional com comandos em linguagem natural
* [x] Documentação completa

---

## 📅 Autor

**Nycollas** - [nycollas.meneses@hotmail.com]
