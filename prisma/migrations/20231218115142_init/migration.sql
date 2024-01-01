/*
  Warnings:

  - Changed the type of `userId` on the `Record` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `version` to the `Time` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `telegramId` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Record" DROP CONSTRAINT "Record_userId_fkey";

-- AlterTable
ALTER TABLE "Record" DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Time" ADD COLUMN     "version" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "telegramId",
ADD COLUMN     "telegramId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_telegramId_key" ON "User"("telegramId");

-- AddForeignKey
ALTER TABLE "Record" ADD CONSTRAINT "Record_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("telegramId") ON DELETE CASCADE ON UPDATE CASCADE;
