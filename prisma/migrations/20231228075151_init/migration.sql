/*
  Warnings:

  - You are about to drop the column `bookedDate` on the `Date` table. All the data in the column will be lost.
  - You are about to drop the column `bookedDateId` on the `Record` table. All the data in the column will be lost.
  - You are about to drop the column `bookedTime` on the `Record` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Time` table. All the data in the column will be lost.
  - Added the required column `date` to the `Date` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateId` to the `Record` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeId` to the `Record` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dateId` to the `Time` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Record" DROP CONSTRAINT "Record_bookedDateId_fkey";

-- DropForeignKey
ALTER TABLE "Time" DROP CONSTRAINT "Time_date_fkey";

-- DropIndex
DROP INDEX "Date_bookedDate_key";

-- AlterTable
ALTER TABLE "Date" DROP COLUMN "bookedDate",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Record" DROP COLUMN "bookedDateId",
DROP COLUMN "bookedTime",
ADD COLUMN     "dateId" INTEGER NOT NULL,
ADD COLUMN     "timeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Time" DROP COLUMN "date",
ADD COLUMN     "dateId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Record" ADD CONSTRAINT "Record_dateId_fkey" FOREIGN KEY ("dateId") REFERENCES "Date"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Time" ADD CONSTRAINT "Time_dateId_fkey" FOREIGN KEY ("dateId") REFERENCES "Date"("id") ON DELETE CASCADE ON UPDATE CASCADE;
