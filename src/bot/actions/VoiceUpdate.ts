import { EmbedBuilder, Guild } from "discord.js";
import { VoiceUpdateType } from "./types";

export async function VoiceUpdate({ newState, oldState, prisma }: VoiceUpdateType) {
  if (!oldState.channel) {
    return;
  }

  //logica para verificar se o usuario saiu da salas
  //quando o usuario sair da sala o oldState.channelId ira existir e será diferente do newState.channelIds
  if (!oldState.channelId || oldState.channelId === newState.channelId) {
    return; //usuário não saiu de uma sala
  }

  const event = await prisma.event.findFirst({
    where: {
      channelID: oldState.channelId,
    },
  });

  if (!event) {
    return;
  }

  const userId = oldState?.member?.user.id;

  if (!userId) {
    return;
  }

  const userTag = `<@${userId}>`;

  const participant = await prisma.participant.findUnique({
    where: {
      userId_eventId: {
        eventId: event.id,
        userId,
      },
    },
  });

  if (!participant) {
    console.error(`Participante ${userTag} não encontrado no evento ${event?.eventName}`);
    return;
  }

  const guildData = await prisma.guilds.findUnique({
    where: {
      guildID: oldState.guild?.id,
    },
  });

  // Busca o canal de participação configurado no banco de dados
  const participationChannelId = guildData?.participationChannelID;
  if (!participationChannelId) {
    console.error(`ID do canal de participação não configurado. execute novamente o /setup`);
    return;
  }

  // Busca o canal de participação no servidor
  const participationChannel = await oldState.guild.channels.fetch(participationChannelId);
  if (!participationChannel?.isTextBased()) {
    console.error(`Canal de texto do evento não encontrado: ${participationChannelId}. execute novamente o /setup`);
    return;
  }

  if (!event.messageID) {
    console.error(`ID da mensagem do evento não encontrado`, oldState.guild.id);
    return;
  }

  // Busca a mensagem do evento usando o messageID armazenado no banco
  let message;

  try {
    message = await participationChannel.messages.fetch(event.messageID);
  } catch (error) {
    console.error(`Mensagem do evento ${event.messageID} não encontrada ou já deletada`, error);
    return;
  }
  const embed = message.embeds[0];
  if (!embed) {
    console.error(`Embed não encontrado na sala de participação do evento: ${event.messageID}`);
    return;
  }

  //logica para fazer a contagem do tempo que o usuario ficou depois de sair do evento
  //remover do banco

  try {
    const joinTime = Number(participant.joinTime);
    const totalTime = Number(participant.totalTime);
    const counter = joinTime ? Date.now() - joinTime : 0;

    if (!participant) {
      return;
    }

    await prisma.participant.update({
      data: {
        joinTime: null,
        totalTime: totalTime + counter,
      },
      where: {
        userId_eventId: {
          eventId: event.id,
          userId,
        },
      },
    });

    //remover da lista de participantes no embed

    const participants = embed.fields.find((text) => text.name === "Participantes")?.value || "Nenhum participant";

    const updateParticipants = participants
      .split("\n")
      .filter((line) => line.trim() !== userTag)
      .join("\n");

    const participantCount = updateParticipants.split("\n").filter((line) => line.trim() !== "").length;

    const updatedEmbed = new EmbedBuilder();
    updatedEmbed.setTitle(embed.title);
    updatedEmbed.addFields(
      embed.fields.map((field) => {
        if (field.name === "Participantes") {
          return {
            ...field,
            value: updateParticipants.length > 0 ? updateParticipants : "Nenhum participante",
          };
        }

        if (field.name === "Qnt Participantes") {
          return {
            ...field,
            value: `${participantCount}`,
          };
        }

        return field;
      })
    );
    updatedEmbed.setDescription(embed.description);
    updatedEmbed.setColor(embed.color);

    await message.edit({ embeds: [updatedEmbed] });
  } catch (error) {
    console.error(`Erro ao atualizar o evento ou remover usuário no banco de dados ${userTag}`, error);
  }
}
