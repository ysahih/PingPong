# For Building
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# For final optimized image
FROM node:18-alpine AS production

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public

ENTRYPOINT [ "npm", "start" ]
