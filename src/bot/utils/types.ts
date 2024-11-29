import { Guild } from "discord.js";

export type sendMessageTypes = {
  guild?: Guild | null;
  messageChannel: string;
  channelID?: string | null;
};
