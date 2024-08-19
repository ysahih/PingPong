# For Building
FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

# For final optimized image
FROM node:18-alpine AS production

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY script.sh .
COPY tsconfig.json .
# COPY .env .
# COPY .env .env

# Generate Prisma client (if needed)
RUN npx prisma generate

ENTRYPOINT [ "sh", "script.sh" ]
