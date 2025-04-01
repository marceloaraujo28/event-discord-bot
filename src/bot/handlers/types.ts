import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { Client } from "discord.js";

export type GuildEventType = {
  client: Client<boolean>;
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
};
