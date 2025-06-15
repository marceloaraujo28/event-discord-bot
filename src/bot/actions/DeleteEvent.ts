import { sendMessageChannel } from "../utils/sendMessageChannel";
import { useT } from "../utils/useT";
import { DeleteEventType } from "./types";

export async function DeleteEvent({ keyTitle, message, prisma, reaction, user, guildData }: DeleteEventType) {
  const language = guildData.language;
  const t = useT(language);

  try {
    await reaction.users.remove(user.id);

    const event = await prisma.event.findFirst({
      where: {
        eventName: keyTitle,
      },
    });

    if (!event) {
      console.log("Evento nao encontrado no banco de dados!");
      return;
    }

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
      messageChannel: t("deleteEvent.canceledMessage", {
        userId: user.id,
      }),
      channelID: guildData?.logsChannelID,
      guild: reaction.message?.guild,
    });

    try {
      const fetchedMessage = await message.channel.messages.fetch(message.id);
      return await fetchedMessage.delete();
    } catch (err) {
      return console.warn(`Não foi possível deletar a mensagem (ID: ${message.id}):`, err);
    }
  } catch (error) {
    console.error(`Erro ao deletar o evento ${keyTitle}`);
    return;
  }
}
