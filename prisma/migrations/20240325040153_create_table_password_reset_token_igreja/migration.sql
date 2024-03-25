-- CreateTable
CREATE TABLE "PasswordResetTokenIgreja" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PasswordResetTokenIgreja_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetTokenIgreja_token_key" ON "PasswordResetTokenIgreja"("token");

-- AddForeignKey
ALTER TABLE "PasswordResetTokenIgreja" ADD CONSTRAINT "PasswordResetTokenIgreja_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserIgreja"("id") ON DELETE CASCADE ON UPDATE CASCADE;
