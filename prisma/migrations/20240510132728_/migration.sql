/*
  Warnings:

  - You are about to alter the column `lossCounter` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `winCounter` on the `Users` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "lossCounter" SET DATA TYPE INTEGER,
ALTER COLUMN "winCounter" SET DATA TYPE INTEGER;
