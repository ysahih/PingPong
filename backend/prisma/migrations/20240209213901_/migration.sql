/*
  Warnings:

  - You are about to drop the column `profileId` on the `Users` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[senderId,receiverId]` on the table `FriendRequests` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Users" DROP CONSTRAINT "Users_profileId_fkey";

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "profileId";

-- CreateIndex
CREATE UNIQUE INDEX "FriendRequests_senderId_receiverId_key" ON "FriendRequests"("senderId", "receiverId");
