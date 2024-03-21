-- CreateTable
CREATE TABLE "ReadBy" (
    "id" SERIAL NOT NULL,
    "messsageId" INTEGER NOT NULL,

    CONSTRAINT "ReadBy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ReadByToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "ReadBy_messsageId_key" ON "ReadBy"("messsageId");

-- CreateIndex
CREATE UNIQUE INDEX "_ReadByToUser_AB_unique" ON "_ReadByToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ReadByToUser_B_index" ON "_ReadByToUser"("B");

-- AddForeignKey
ALTER TABLE "ReadBy" ADD CONSTRAINT "ReadBy_messsageId_fkey" FOREIGN KEY ("messsageId") REFERENCES "Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ReadByToUser" ADD CONSTRAINT "_ReadByToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "ReadBy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ReadByToUser" ADD CONSTRAINT "_ReadByToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
