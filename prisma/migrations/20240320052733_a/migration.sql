-- DropForeignKey
ALTER TABLE "RefreshTokenIgreja" DROP CONSTRAINT "RefreshTokenIgreja_userId_fkey";

-- AddForeignKey
ALTER TABLE "RefreshTokenIgreja" ADD CONSTRAINT "RefreshTokenIgreja_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserIgreja"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
