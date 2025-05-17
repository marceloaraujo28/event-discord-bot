-- AlterTable
ALTER TABLE "Guilds" ADD COLUMN     "guildName" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "priceLanguage" TEXT DEFAULT 'pt-BR';
