/*
  Warnings:

  - The `expires` column on the `UserIgreja` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "UserIgreja" DROP COLUMN "expires",
ADD COLUMN     "expires" TIMESTAMP(3);
