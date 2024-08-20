#! /bin/bash

sleep 10s

# put prisma schema to the PostgreSQL DB
npx prisma migrate dev

# Start the server
npm start