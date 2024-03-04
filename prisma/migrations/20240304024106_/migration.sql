-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "secret" TEXT,
ADD COLUMN     "twoFa" BOOLEAN NOT NULL DEFAULT false;
