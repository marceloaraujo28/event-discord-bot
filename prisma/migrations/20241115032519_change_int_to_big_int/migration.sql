-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "startTime" SET DATA TYPE BIGINT,
ALTER COLUMN "endTime" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "Participant" ALTER COLUMN "joinTime" SET DATA TYPE BIGINT;
