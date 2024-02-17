-- DropForeignKey
ALTER TABLE "FriendRequests" DROP CONSTRAINT "FriendRequests_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "FriendRequests" DROP CONSTRAINT "FriendRequests_senderId_fkey";

-- AlterTable
ALTER TABLE "FriendRequests" ADD COLUMN     "accepted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "blocked" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "senderId" DROP NOT NULL,
ALTER COLUMN "receiverId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "profileId" INTEGER;

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendRequests" ADD CONSTRAINT "FriendRequests_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FriendRequests" ADD CONSTRAINT "FriendRequests_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
