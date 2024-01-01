/*
  Warnings:

  - You are about to drop the column `timeSlot` on the `Time` table. All the data in the column will be lost.
  - Made the column `bookedDateId` on table `Record` required. This step will fail if there are existing NULL values in that column.
  - Made the column `bookedTime` on table `Record` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `timeEnd` to the `Time` table without a default value. This is not possible if the table is not empty.
  - Added the required column `timeStart` to the `Time` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Record" ALTER COLUMN "bookedDateId" SET NOT NULL,
ALTER COLUMN "bookedTime" SET NOT NULL;

-- AlterTable
ALTER TABLE "Time" DROP COLUMN "timeSlot",
ADD COLUMN     "timeEnd" INTEGER NOT NULL,
ADD COLUMN     "timeStart" INTEGER NOT NULL;
