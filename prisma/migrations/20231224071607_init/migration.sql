/*
  Warnings:

  - You are about to drop the column `dateId` on the `Time` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[bookedDate]` on the table `Date` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `date` to the `Time` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Time" DROP CONSTRAINT "Time_dateId_fkey";

-- AlterTable
ALTER TABLE "Record" ADD COLUMN     "bookedTime" TEXT,
ALTER COLUMN "bookedDateId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Time" DROP COLUMN "dateId",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Date_bookedDate_key" ON "Date"("bookedDate");

-- AddForeignKey
ALTER TABLE "Time" ADD CONSTRAINT "Time_date_fkey" FOREIGN KEY ("date") REFERENCES "Date"("bookedDate") ON DELETE CASCADE ON UPDATE CASCADE;
