/*
  Warnings:

  - You are about to drop the column `instagran` on the `Contato` table. All the data in the column will be lost.
  - Added the required column `instagram` to the `Contato` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Contato" DROP COLUMN "instagran",
ADD COLUMN     "instagram" TEXT NOT NULL;
