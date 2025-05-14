
def interpret_command(command: str) -> str:
    if "quantos produtos" in command.lower():
        return "/products"
    if "movimentações" in command.lower():
        return "/movements"
    return "Comando não reconhecido. Tente novamente."
