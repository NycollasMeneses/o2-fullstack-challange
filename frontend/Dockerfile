# Use o node como imagem base
FROM node:16

# Crie o diretório de trabalho
WORKDIR /app

# Copie o package.json e o package-lock.json
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o código do front-end para o container
COPY . .

# Exponha a porta onde o React estará rodando
EXPOSE 3000

# Inicie o front-end
CMD ["npm", "start"]
