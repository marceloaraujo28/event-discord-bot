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
import { Prisma, PrismaClient } from "@prisma/client";
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

export type ParticipateEventType = EventBaseType;

export type StartEventType = {
  creatorName?: string | null;
} & EventBaseType;

export type FinishedEventType = Omit<EventBaseType, "eventNumber">;
export type VoiceUpdateType = {
  oldState: VoiceState;
  newState: VoiceState;
} & Pick<EventBaseType, "prisma">;

export type DeleteEventType = { creatorName?: string | null } & Omit<EventBaseType, "eventNumber" | "embed">;
