-- CreateTable
CREATE TABLE "Guilds" (
    "guildID" TEXT NOT NULL,
    "newEventChannelID" TEXT,
    "participationChannelID" TEXT,
    "logsChannelID" TEXT,
    "waitingVoiceChannelID" TEXT,
    "startedCategoryID" TEXT,
    "endedCategoryID" TEXT,

    CONSTRAINT "Guilds_pkey" PRIMARY KEY ("guildID")
);
