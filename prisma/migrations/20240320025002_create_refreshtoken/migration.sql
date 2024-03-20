/*
  Warnings:

  - You are about to drop the `Sobree` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Sobree" DROP CONSTRAINT "Sobree_userId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "refreshToken" TEXT;

-- DropTable
DROP TABLE "Sobree";
