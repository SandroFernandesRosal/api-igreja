/*
  Warnings:

  - Added the required column `local` to the `Contato` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Contato" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "local" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "instagran" TEXT NOT NULL,
    "facebook" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Contato_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Contato" ("createdAt", "facebook", "id", "instagran", "isPublic", "userId", "whatsapp") SELECT "createdAt", "facebook", "id", "instagran", "isPublic", "userId", "whatsapp" FROM "Contato";
DROP TABLE "Contato";
ALTER TABLE "new_Contato" RENAME TO "Contato";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
