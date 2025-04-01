-- AddForeignKey
ALTER TABLE "Participant" ADD CONSTRAINT "Participant_guildID_fkey" FOREIGN KEY ("guildID") REFERENCES "Guilds"("guildID") ON DELETE CASCADE ON UPDATE CASCADE;
