import {
  Embed,
  Message,
  MessageReaction,
  PartialMessage,
  PartialMessageReaction,
  PartialUser,
  User,
  VoiceState,
} from "discord.js";
import { Guilds, Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

export type EventBaseType = {
  reaction: MessageReaction | PartialMessageReaction;
  user: User | PartialUser;
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
  message: Message<boolean> | PartialMessage;
  embed: Embed;
  keyTitle: string;
  eventNumber: string;
};

export type ParticipateEventType = EventBaseType & { guildData: Guilds };

export type StartEventType = {
  guildData: Guilds;
} & EventBaseType;

export type FinishedEventType = Omit<EventBaseType, "eventNumber"> & { guildData: Guilds };
export type VoiceUpdateType = {
  oldState: VoiceState;
  newState: VoiceState;
  guildData: Guilds;
} & Pick<EventBaseType, "prisma">;

export type DeleteEventType = { guildData: Guilds } & Omit<EventBaseType, "eventNumber" | "embed">;
