/*
  Warnings:

  - You are about to drop the `Time` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `bookedTime` to the `Record` table without a default value. This is not possible if the table is not empty.
  - Added the required column `version` to the `Record` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Time" DROP CONSTRAINT "Time_recordId_fkey";

-- AlterTable
ALTER TABLE "Record" ADD COLUMN     "bookedTime" TEXT NOT NULL,
ADD COLUMN     "version" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Time";
