-- CreateTable
CREATE TABLE "WorkResponsibility" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "workId" INTEGER NOT NULL,

    CONSTRAINT "WorkResponsibility_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WorkResponsibility_workId_idx" ON "WorkResponsibility"("workId");

-- AddForeignKey
ALTER TABLE "WorkResponsibility" ADD CONSTRAINT "WorkResponsibility_workId_fkey" FOREIGN KEY ("workId") REFERENCES "Work"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
