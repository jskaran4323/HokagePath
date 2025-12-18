FROM node:21-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY .env.dev .env.dev

EXPOSE 5173

CMD [ "npm", "run", "dev" ]