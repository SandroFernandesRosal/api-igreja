-- AlterTable
ALTER TABLE "UserIgreja" ADD COLUMN     "expiresAt" TIMESTAMP(3),
ADD COLUMN     "passwordReset" TEXT,
ADD COLUMN     "tokenReset" TEXT,
ALTER COLUMN "login" DROP NOT NULL,
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "avatarUrl" DROP NOT NULL;
