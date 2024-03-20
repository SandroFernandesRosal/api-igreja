-- CreateTable
CREATE TABLE "UserIgreja" (
    "id" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatarUrl" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "UserIgreja_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testemunho" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatarUrl" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Testemunho_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserIgreja_login_key" ON "UserIgreja"("login");

-- AddForeignKey
ALTER TABLE "Testemunho" ADD CONSTRAINT "Testemunho_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserIgreja"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
