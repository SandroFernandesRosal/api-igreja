/*
  Warnings:

  - You are about to drop the `Ministerio` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `coverUrl` to the `MinisterioCaxias` table without a default value. This is not possible if the table is not empty.
  - Added the required column `coverUrl` to the `MinisterioTomazinho` table without a default value. This is not possible if the table is not empty.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Ministerio";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Ministerioo" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "local" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "coverUrl" TEXT NOT NULL
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MinisterioCaxias" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "local" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "coverUrl" TEXT NOT NULL
);
INSERT INTO "new_MinisterioCaxias" ("createdAt", "id", "isPublic", "local", "name", "title", "userId") SELECT "createdAt", "id", "isPublic", "local", "name", "title", "userId" FROM "MinisterioCaxias";
DROP TABLE "MinisterioCaxias";
ALTER TABLE "new_MinisterioCaxias" RENAME TO "MinisterioCaxias";
CREATE TABLE "new_MinisterioTomazinho" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "local" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "coverUrl" TEXT NOT NULL
);
INSERT INTO "new_MinisterioTomazinho" ("createdAt", "id", "isPublic", "local", "name", "title", "userId") SELECT "createdAt", "id", "isPublic", "local", "name", "title", "userId" FROM "MinisterioTomazinho";
DROP TABLE "MinisterioTomazinho";
ALTER TABLE "new_MinisterioTomazinho" RENAME TO "MinisterioTomazinho";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
