/*
  Warnings:

  - Added the required column `agencia` to the `Doacao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `banco` to the `Doacao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nomebanco` to the `Doacao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nomepix` to the `Doacao` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Doacao" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "local" TEXT NOT NULL,
    "banco" TEXT NOT NULL,
    "conta" TEXT NOT NULL,
    "agencia" TEXT NOT NULL,
    "nomebanco" TEXT NOT NULL,
    "pix" TEXT NOT NULL,
    "nomepix" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Doacao_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Doacao" ("conta", "createdAt", "id", "isPublic", "local", "pix", "userId") SELECT "conta", "createdAt", "id", "isPublic", "local", "pix", "userId" FROM "Doacao";
DROP TABLE "Doacao";
ALTER TABLE "new_Doacao" RENAME TO "Doacao";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
