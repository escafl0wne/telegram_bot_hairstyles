/*
  Warnings:

  - You are about to drop the column `bookedDate` on the `Record` table. All the data in the column will be lost.
  - You are about to drop the column `bookedTime` on the `Record` table. All the data in the column will be lost.
  - You are about to drop the column `version` on the `Record` table. All the data in the column will be lost.
  - Added the required column `bookedDateId` to the `Record` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Record" DROP COLUMN "bookedDate",
DROP COLUMN "bookedTime",
DROP COLUMN "version",
ADD COLUMN     "bookedDateId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Date" (
    "id" SERIAL NOT NULL,
    "bookedDate" TIMESTAMP(3) NOT NULL,
    "isFullyBooked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Date_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Time" (
    "id" SERIAL NOT NULL,
    "timeSlot" TEXT NOT NULL,
    "dateId" INTEGER NOT NULL,
    "version" INTEGER NOT NULL,
    "isBooked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Time_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Record" ADD CONSTRAINT "Record_bookedDateId_fkey" FOREIGN KEY ("bookedDateId") REFERENCES "Date"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Time" ADD CONSTRAINT "Time_dateId_fkey" FOREIGN KEY ("dateId") REFERENCES "Date"("id") ON DELETE CASCADE ON UPDATE CASCADE;
