/*
  Warnings:

  - A unique constraint covering the columns `[recordId]` on the table `Time` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `recordId` to the `Time` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Time" ADD COLUMN     "recordId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Time_recordId_key" ON "Time"("recordId");

-- AddForeignKey
ALTER TABLE "Time" ADD CONSTRAINT "Time_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "Record"("id") ON DELETE CASCADE ON UPDATE CASCADE;
