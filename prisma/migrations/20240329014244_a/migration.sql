/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `UserIgreja` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `UserIgreja` table. All the data in the column will be lost.
  - Made the column `login` on table `UserIgreja` required. This step will fail if there are existing NULL values in that column.
  - Made the column `name` on table `UserIgreja` required. This step will fail if there are existing NULL values in that column.
  - Made the column `avatarUrl` on table `UserIgreja` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "UserIgreja" DROP COLUMN "expiresAt",
DROP COLUMN "token",
ALTER COLUMN "login" SET NOT NULL,
ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "avatarUrl" SET NOT NULL;
