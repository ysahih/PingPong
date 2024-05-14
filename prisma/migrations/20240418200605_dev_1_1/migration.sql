/*
  Warnings:

  - Added the required column `opponentId` to the `History` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "History" ADD COLUMN     "opponentId" INTEGER NOT NULL;
