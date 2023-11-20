/*
  Warnings:

  - You are about to drop the `Agendaa` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `title` to the `New` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Agendaa";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_New" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "coverUrl" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "New_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_New" ("content", "coverUrl", "createdAt", "id", "isPublic", "userId") SELECT "content", "coverUrl", "createdAt", "id", "isPublic", "userId" FROM "New";
DROP TABLE "New";
ALTER TABLE "new_New" RENAME TO "New";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
