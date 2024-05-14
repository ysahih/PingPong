-- CreateTable
CREATE TABLE "History" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "result" TEXT NOT NULL,

    CONSTRAINT "History_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
