/*
  Warnings:

  - Added the required column `page` to the `New` table without a default value. This is not possible if the table is not empty.
  - Added the required column `page` to the `NewTomazinho` table without a default value. This is not possible if the table is not empty.
  - Added the required column `page` to the `NewCaxias` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AgendaCaxias" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hour" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_AgendaCaxias" ("createdAt", "day", "hour", "id", "isPublic", "name", "userId") SELECT "createdAt", "day", "hour", "id", "isPublic", "name", "userId" FROM "AgendaCaxias";
DROP TABLE "AgendaCaxias";
ALTER TABLE "new_AgendaCaxias" RENAME TO "AgendaCaxias";
CREATE TABLE "new_New" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "coverUrl" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "page" TEXT NOT NULL,
    CONSTRAINT "New_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_New" ("content", "coverUrl", "createdAt", "id", "isPublic", "title", "userId") SELECT "content", "coverUrl", "createdAt", "id", "isPublic", "title", "userId" FROM "New";
DROP TABLE "New";
ALTER TABLE "new_New" RENAME TO "New";
CREATE TABLE "new_AgendaTomazinho" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hour" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_AgendaTomazinho" ("createdAt", "day", "hour", "id", "isPublic", "name", "userId") SELECT "createdAt", "day", "hour", "id", "isPublic", "name", "userId" FROM "AgendaTomazinho";
DROP TABLE "AgendaTomazinho";
ALTER TABLE "new_AgendaTomazinho" RENAME TO "AgendaTomazinho";
CREATE TABLE "new_MinisterioCaxias" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "local" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_MinisterioCaxias" ("createdAt", "id", "isPublic", "local", "name", "title", "userId") SELECT "createdAt", "id", "isPublic", "local", "name", "title", "userId" FROM "MinisterioCaxias";
DROP TABLE "MinisterioCaxias";
ALTER TABLE "new_MinisterioCaxias" RENAME TO "MinisterioCaxias";
CREATE TABLE "new_Agenda" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hour" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Agenda" ("createdAt", "day", "hour", "id", "isPublic", "name", "userId") SELECT "createdAt", "day", "hour", "id", "isPublic", "name", "userId" FROM "Agenda";
DROP TABLE "Agenda";
ALTER TABLE "new_Agenda" RENAME TO "Agenda";
CREATE TABLE "new_Ministerio" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "local" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Ministerio" ("createdAt", "id", "isPublic", "local", "name", "title", "userId") SELECT "createdAt", "id", "isPublic", "local", "name", "title", "userId" FROM "Ministerio";
DROP TABLE "Ministerio";
ALTER TABLE "new_Ministerio" RENAME TO "Ministerio";
CREATE TABLE "new_NewTomazinho" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "coverUrl" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "page" TEXT NOT NULL,
    CONSTRAINT "NewTomazinho_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_NewTomazinho" ("content", "coverUrl", "createdAt", "id", "isPublic", "title", "userId") SELECT "content", "coverUrl", "createdAt", "id", "isPublic", "title", "userId" FROM "NewTomazinho";
DROP TABLE "NewTomazinho";
ALTER TABLE "new_NewTomazinho" RENAME TO "NewTomazinho";
CREATE TABLE "new_NewCaxias" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "coverUrl" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "page" TEXT NOT NULL,
    CONSTRAINT "NewCaxias_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_NewCaxias" ("content", "coverUrl", "createdAt", "id", "isPublic", "title", "userId") SELECT "content", "coverUrl", "createdAt", "id", "isPublic", "title", "userId" FROM "NewCaxias";
DROP TABLE "NewCaxias";
ALTER TABLE "new_NewCaxias" RENAME TO "NewCaxias";
CREATE TABLE "new_MinisterioTomazinho" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "local" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_MinisterioTomazinho" ("createdAt", "id", "isPublic", "local", "name", "title", "userId") SELECT "createdAt", "id", "isPublic", "local", "name", "title", "userId" FROM "MinisterioTomazinho";
DROP TABLE "MinisterioTomazinho";
ALTER TABLE "new_MinisterioTomazinho" RENAME TO "MinisterioTomazinho";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
