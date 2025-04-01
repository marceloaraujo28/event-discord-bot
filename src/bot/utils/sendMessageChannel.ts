import { sendMessageTypes } from "./types";

export async function sendMessageChannel({ channelID, messageChannel, guild }: sendMessageTypes) {
  if (!guild || !channelID) {
    console.error("Guild ou ChannelID não existem!");
    return;
  }

  const channel = guild.channels.cache.get(channelID);

  if (!channel) {
    console.warn(`Aviso: O canal com ID ${channelID} não foi encontrado na guilda ${guild.id}.`);
    return;
  }

  if (!channel?.isTextBased()) {
    console.warn(`Aviso: O canal ${channel.id} não é baseado em texto.`);
    return;
  }

  try {
    return await channel.send(messageChannel);
  } catch (error) {
    console.error(`Erro ao enviar mensagem no canal ${channel.id}:`, error);
  }

  return;
}
