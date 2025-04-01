/*
  Warnings:

  - A unique constraint covering the columns `[userId,guildID]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `guildID` to the `Participant` table without a default value. This is not possible if the table is not empty.
  - Made the column `guildID` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Participant" DROP CONSTRAINT "Participant_userId_fkey";

-- DropIndex
DROP INDEX "User_userId_key";

-- AlterTable
ALTER TABLE "Participant" ADD COLUMN     "guildID" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "guildID" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_userId_guildID_key" ON "User"("userId", "guildID");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_guildID_fkey" FOREIGN KEY ("guildID") REFERENCES "Guilds"("guildID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_userId_guildID_fkey" FOREIGN KEY ("userId", "guildID") REFERENCES "User"("userId", "guildID") ON DELETE RESTRICT ON UPDATE CASCADE;
