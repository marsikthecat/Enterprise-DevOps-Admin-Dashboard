FROM node:20-bullseye

WORKDIR /app/backend

COPY backend ./

RUN npm install --prefix /app/backend
RUN npx prisma generate --schema /app/backend/prisma/schema.prisma

EXPOSE 3000

CMD ["npm", "run", "dev", "--prefix", "/app/backend"]
