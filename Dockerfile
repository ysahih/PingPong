FROM node:bullseye

RUN apt update -y

WORKDIR /front

COPY package*.json .

RUN npm i

COPY . .

RUN npm run build

ENTRYPOINT [ "npm", "start" ]