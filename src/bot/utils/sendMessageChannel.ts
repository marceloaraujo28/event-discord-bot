import { sendMessageTypes } from "./types";

export async function sendMessageChannel({ channelID, messageChannel, guild }: sendMessageTypes) {
  if (!guild || !channelID) {
    console.error("Guild ou ChannelID não existem!");
    return;
  }

  const channel = guild.channels.cache.get(channelID);

  if (channel?.isTextBased()) {
    return await channel.send(messageChannel);
  }

  return;
}
