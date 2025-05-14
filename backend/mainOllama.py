from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import httpx

app = FastAPI()

# Libera acesso ao frontend (React) local
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # ajuste se React rodar em outra URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/ask")
async def ask_llama(req: Request):
    try:
        body = await req.json()
        prompt = body.get("prompt", "").strip()

        if not prompt:
            return {"error": "Prompt vazio."}

        async with httpx.AsyncClient() as client:
            response = await client.post(
                "http://localhost:11434/api/generate",
                json={
                    "model": "llama3",
                    "prompt": prompt,
                    "stream": False
                },
                timeout=30.0
            )
            response.raise_for_status()
            data = response.json()

        return {"response": data.get("response", "").strip()}

    except httpx.RequestError as e:
        return {"error": f"Erro de conexão com o Ollama: {e}"}

    except httpx.HTTPStatusError as e:
        return {"error": f"Erro HTTP do Ollama: {e.response.status_code} - {e.response.text}"}

    except Exception as e:
        return {"error": f"Erro inesperado: {str(e)}"}
