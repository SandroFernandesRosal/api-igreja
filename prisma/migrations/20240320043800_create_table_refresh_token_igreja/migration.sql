-- CreateTable
CREATE TABLE "RefreshTokenIgreja" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RefreshTokenIgreja_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RefreshTokenIgreja_token_key" ON "RefreshTokenIgreja"("token");

-- AddForeignKey
ALTER TABLE "RefreshTokenIgreja" ADD CONSTRAINT "RefreshTokenIgreja_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserIgreja"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
