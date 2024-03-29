/*
  Warnings:

  - You are about to drop the column `passwordReset` on the `UserIgreja` table. All the data in the column will be lost.
  - You are about to drop the column `tokenReset` on the `UserIgreja` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserIgreja" DROP COLUMN "passwordReset",
DROP COLUMN "tokenReset",
ADD COLUMN     "token" TEXT;
