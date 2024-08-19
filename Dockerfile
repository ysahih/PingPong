FROM node:bullseye

RUN apt update -y

WORKDIR /back

COPY package*.json .

RUN npm i

COPY . .

RUN npx prisma generate

RUN npm run build

# RUN npx prisma migrate dev


ENTRYPOINT [ "bash", "script.sh" ]