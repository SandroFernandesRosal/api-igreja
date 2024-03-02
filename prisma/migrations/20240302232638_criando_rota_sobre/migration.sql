/*
  Warnings:

  - Added the required column `updatedAt` to the `Agenda` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `AgendaCaxias` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `AgendaTomazinho` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Contato` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Doacao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Endereco` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Ministerio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `MinisterioCaxias` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `MinisterioTomazinho` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `New` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `NewCaxias` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `NewTomazinho` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Agenda" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "AgendaCaxias" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "AgendaTomazinho" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Contato" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Doacao" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Endereco" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Ministerio" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "MinisterioCaxias" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "MinisterioTomazinho" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "New" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "NewCaxias" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "NewTomazinho" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Sobre" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "coverUrl" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Sobre_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Sobre" ADD CONSTRAINT "Sobre_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
