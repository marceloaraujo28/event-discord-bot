import { Guild, MessageCreateOptions, MessagePayload } from "discord.js";

export type sendMessageTypes = {
  guild?: Guild | null;
  messageChannel: string | MessagePayload | MessageCreateOptions;
  channelID?: string | null;
};
