
from fastapi import APIRouter
from pydantic import BaseModel
from app.ai_agent import interpret_command

router = APIRouter()

class Command(BaseModel):
    text: str

@router.post("/")
def ai_command(cmd: Command):
    result = interpret_command(cmd.text)
    return {"result": result}
