import { sendMessageChannel } from "../utils/sendMessageChannel";
import { DeleteEventType } from "./types";

export async function DeleteEvent({ keyTitle, message, prisma, reaction, user, creatorName }: DeleteEventType) {
  try {
    const guildData = await prisma.guilds.findUnique({
      where: {
        guildID: reaction.message?.guild?.id,
      },
    });

    const event = await prisma.event.findFirst({
      where: {
        eventName: keyTitle,
      },
    });

    const eventChannel = message.guild?.channels.cache.get(event?.channelID ?? "");

    if (!eventChannel || !eventChannel.isVoiceBased()) {
      console.error("Erro ao deletar, Canal de voz do evento não encontrado ou não é um canal de voz!");
      return;
    }

    const members = eventChannel.members;
    // Buscar o canal de espera (waitingVoiceChannelID)
    const waitingVoiceChannel = message.guild?.channels.cache.get(guildData?.waitingVoiceChannelID ?? "");

    if (waitingVoiceChannel && waitingVoiceChannel.isVoiceBased()) {
      // Transferir cada membro para a sala de espera
      for (const [_, member] of members) {
        await member.voice.setChannel(waitingVoiceChannel).catch((err) => {
          console.error(`Erro ao mover membro ${member.user.tag}:`, err);
        });
      }
    } else {
      console.error("Canal de espera não encontrado ou não é de voz!");
    }

    await eventChannel?.delete(); // Deletar apenas se existir

    //deletando evento do banco
    await prisma.event.delete({
      where: {
        id: event?.id,
      },
    });

    //enviar mensagem de cancelamento do evento
    await sendMessageChannel({
      messageChannel: `<@${user.id}> cancelou o evento!`,
      channelID: guildData?.logsChannelID,
      guild: reaction.message?.guild,
    });

    await message.delete();
  } catch (error) {
    console.error(`Erro ao deletar o evento ${keyTitle}`);
  }
}
