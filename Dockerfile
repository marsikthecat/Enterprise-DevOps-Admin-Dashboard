FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json pnpm-workspace.yaml ./
COPY vite.config.ts postcss.config.mjs index.html ./
COPY public ./public
COPY src ./src
COPY default_shadcn_theme.css ./
COPY .env ./.env

RUN npm install

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]
