/*
  Warnings:

  - You are about to drop the `doacao` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "doacao";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Doacao" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "local" TEXT NOT NULL,
    "conta" TEXT NOT NULL,
    "pix" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Doacao_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Endereco" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "local" TEXT NOT NULL,
    "rua" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Endereco_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Contato" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "instagran" TEXT NOT NULL,
    "facebook" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Contato_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Agenda" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hour" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Agenda_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Agenda" ("createdAt", "day", "hour", "id", "isPublic", "name", "userId") SELECT "createdAt", "day", "hour", "id", "isPublic", "name", "userId" FROM "Agenda";
DROP TABLE "Agenda";
ALTER TABLE "new_Agenda" RENAME TO "Agenda";
CREATE TABLE "new_AgendaTomazinho" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hour" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AgendaTomazinho_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_AgendaTomazinho" ("createdAt", "day", "hour", "id", "isPublic", "name", "userId") SELECT "createdAt", "day", "hour", "id", "isPublic", "name", "userId" FROM "AgendaTomazinho";
DROP TABLE "AgendaTomazinho";
ALTER TABLE "new_AgendaTomazinho" RENAME TO "AgendaTomazinho";
CREATE TABLE "new_MinisterioTomazinho" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "local" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "coverUrl" TEXT NOT NULL,
    CONSTRAINT "MinisterioTomazinho_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_MinisterioTomazinho" ("coverUrl", "createdAt", "id", "isPublic", "local", "name", "title", "userId") SELECT "coverUrl", "createdAt", "id", "isPublic", "local", "name", "title", "userId" FROM "MinisterioTomazinho";
DROP TABLE "MinisterioTomazinho";
ALTER TABLE "new_MinisterioTomazinho" RENAME TO "MinisterioTomazinho";
CREATE TABLE "new_AgendaCaxias" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hour" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AgendaCaxias_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_AgendaCaxias" ("createdAt", "day", "hour", "id", "isPublic", "name", "userId") SELECT "createdAt", "day", "hour", "id", "isPublic", "name", "userId" FROM "AgendaCaxias";
DROP TABLE "AgendaCaxias";
ALTER TABLE "new_AgendaCaxias" RENAME TO "AgendaCaxias";
CREATE TABLE "new_MinisterioCaxias" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "local" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "coverUrl" TEXT NOT NULL,
    CONSTRAINT "MinisterioCaxias_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_MinisterioCaxias" ("coverUrl", "createdAt", "id", "isPublic", "local", "name", "title", "userId") SELECT "coverUrl", "createdAt", "id", "isPublic", "local", "name", "title", "userId" FROM "MinisterioCaxias";
DROP TABLE "MinisterioCaxias";
ALTER TABLE "new_MinisterioCaxias" RENAME TO "MinisterioCaxias";
CREATE TABLE "new_Ministerio" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "local" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "coverUrl" TEXT NOT NULL,
    CONSTRAINT "Ministerio_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Ministerio" ("coverUrl", "createdAt", "id", "isPublic", "local", "name", "title", "userId") SELECT "coverUrl", "createdAt", "id", "isPublic", "local", "name", "title", "userId" FROM "Ministerio";
DROP TABLE "Ministerio";
ALTER TABLE "new_Ministerio" RENAME TO "Ministerio";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
