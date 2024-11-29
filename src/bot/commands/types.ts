import { ButtonInteraction, CommandInteraction } from "discord.js";
import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

export type OpenEventType = {
  interaction: CommandInteraction | ButtonInteraction;
};

export type SetupType = {
  interaction: CommandInteraction;
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
};
