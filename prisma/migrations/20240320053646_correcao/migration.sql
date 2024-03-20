-- DropForeignKey
ALTER TABLE "Agenda" DROP CONSTRAINT "Agenda_userId_fkey";

-- DropForeignKey
ALTER TABLE "AgendaCaxias" DROP CONSTRAINT "AgendaCaxias_userId_fkey";

-- DropForeignKey
ALTER TABLE "AgendaTomazinho" DROP CONSTRAINT "AgendaTomazinho_userId_fkey";

-- DropForeignKey
ALTER TABLE "Contato" DROP CONSTRAINT "Contato_userId_fkey";

-- DropForeignKey
ALTER TABLE "Doacao" DROP CONSTRAINT "Doacao_userId_fkey";

-- DropForeignKey
ALTER TABLE "Endereco" DROP CONSTRAINT "Endereco_userId_fkey";

-- DropForeignKey
ALTER TABLE "Ministerio" DROP CONSTRAINT "Ministerio_userId_fkey";

-- DropForeignKey
ALTER TABLE "MinisterioCaxias" DROP CONSTRAINT "MinisterioCaxias_userId_fkey";

-- DropForeignKey
ALTER TABLE "MinisterioTomazinho" DROP CONSTRAINT "MinisterioTomazinho_userId_fkey";

-- DropForeignKey
ALTER TABLE "New" DROP CONSTRAINT "New_userId_fkey";

-- DropForeignKey
ALTER TABLE "NewCaxias" DROP CONSTRAINT "NewCaxias_userId_fkey";

-- DropForeignKey
ALTER TABLE "NewTomazinho" DROP CONSTRAINT "NewTomazinho_userId_fkey";

-- DropForeignKey
ALTER TABLE "RefreshToken" DROP CONSTRAINT "RefreshToken_userId_fkey";

-- DropForeignKey
ALTER TABLE "Sobre" DROP CONSTRAINT "Sobre_userId_fkey";

-- DropForeignKey
ALTER TABLE "SobreLider" DROP CONSTRAINT "SobreLider_userId_fkey";

-- DropForeignKey
ALTER TABLE "Testemunho" DROP CONSTRAINT "Testemunho_userId_fkey";

-- AddForeignKey
ALTER TABLE "New" ADD CONSTRAINT "New_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ministerio" ADD CONSTRAINT "Ministerio_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agenda" ADD CONSTRAINT "Agenda_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewTomazinho" ADD CONSTRAINT "NewTomazinho_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MinisterioTomazinho" ADD CONSTRAINT "MinisterioTomazinho_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgendaTomazinho" ADD CONSTRAINT "AgendaTomazinho_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NewCaxias" ADD CONSTRAINT "NewCaxias_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MinisterioCaxias" ADD CONSTRAINT "MinisterioCaxias_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AgendaCaxias" ADD CONSTRAINT "AgendaCaxias_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Doacao" ADD CONSTRAINT "Doacao_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Endereco" ADD CONSTRAINT "Endereco_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contato" ADD CONSTRAINT "Contato_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sobre" ADD CONSTRAINT "Sobre_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SobreLider" ADD CONSTRAINT "SobreLider_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefreshToken" ADD CONSTRAINT "RefreshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Testemunho" ADD CONSTRAINT "Testemunho_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserIgreja"("id") ON DELETE CASCADE ON UPDATE CASCADE;
