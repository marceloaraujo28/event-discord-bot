import {
  Embed,
  Message,
  MessageReaction,
  PartialMessage,
  PartialMessageReaction,
  PartialUser,
  User,
} from "discord.js";
import { ParticipantTimesType } from "../types";

export type ParticipateEventType = {
  reaction: MessageReaction | PartialMessageReaction;
  user: User | PartialUser;
  eventCounter: number;
  eventStore: Record<string, Record<string, ParticipantTimesType>>;
};

export type StartEventType = {
  reaction: MessageReaction | PartialMessageReaction;
  user: User | PartialUser;
  eventStore: Record<string, Record<string, ParticipantTimesType>>;
  creatorName?: string | null;
  message: Message<boolean> | PartialMessage;
  embed: Embed;
  eventCounter: number;
};
