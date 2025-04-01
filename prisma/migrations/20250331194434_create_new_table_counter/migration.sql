-- CreateTable
CREATE TABLE "GlobalEventCounter" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "lastNumber" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "GlobalEventCounter_pkey" PRIMARY KEY ("id")
);
