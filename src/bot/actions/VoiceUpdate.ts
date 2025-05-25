import { EmbedBuilder, Guild } from "discord.js";
import { VoiceUpdateType } from "./types";
import { useT } from "../utils/useT";

export async function VoiceUpdate({ newState, oldState, prisma, guildData }: VoiceUpdateType) {
  if (!oldState.channel) {
    return;
  }

  //logica para verificar se o usuario saiu da salas
  //quando o usuario sair da sala o oldState.channelId ira existir e será diferente do newState.channelIds
  if (!oldState.channelId || oldState.channelId === newState.channelId) {
    return; //usuário não saiu de uma sala
  }

  const userId = oldState?.member?.user.id;

  if (!userId) {
    return;
  }

  const language = guildData.language;
  const t = useT(language);

  const userTag = `<@${userId}>`;

  let participant;
  let event;

  try {
    event = await prisma.event.findFirst({
      where: {
        channelID: oldState.channelId,
      },
    });

    if (!event) {
      return;
    }

    participant = await prisma.participant.findUnique({
      where: {
        userId_eventId: {
          eventId: event.id,
          userId,
        },
      },
    });

    if (!participant) {
      return;
    }
  } catch (error) {
    console.error(`Erro ao buscar participante ${userTag} no evento ${event?.eventName}`, error);
    return;
  }

  // Busca a mensagem do evento usando o messageID armazenado no banco
  let message;

  try {
    // Busca o canal de participação configurado no banco de dados
    const participationChannelId = guildData?.participationChannelID;
    if (!participationChannelId) {
      console.error(`ID do canal de participação não configurado. ${event.eventName}${oldState.guild.name}`);
      return;
    }

    // Busca o canal de participação no servidor
    const participationChannel = await oldState.guild.channels.fetch(participationChannelId);
    if (!participationChannel?.isTextBased()) {
      console.error(`Canal de texto do ${event.eventName} não encontrado: ${participationChannelId}`);
      return;
    }

    if (!event.messageID) {
      console.error(`ID da mensagem do evento não encontrado`, oldState.guild.id);
      return;
    }
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

    const embedFields = [...embed.fields];
    const participants = embedFields[3].value;

    const updateParticipants = participants
      .split("\n")
      .filter((line) => line.trim() !== userTag)
      .join("\n");

    const participantCount = updateParticipants.split("\n").filter((line) => line.trim() !== "").length;

    //atualizar participantes
    embedFields[3] = {
      ...embedFields[3],
      value: updateParticipants.length > 0 ? updateParticipants : t("voiceUpdate.noPlayer"),
    };

    //atualizar quantidade participantes
    embedFields[2] = {
      ...embedFields[2],
      value: `${participantCount}`,
    };

    const updatedEmbed = new EmbedBuilder();
    updatedEmbed.setTitle(embed.title);
    updatedEmbed.addFields(embedFields);
    updatedEmbed.setDescription(embed.description);
    updatedEmbed.setColor(embed.color);

    if (!message.editable) {
      console.error(
        `A mensagem ${event.messageID} não está mais editável (pode ter sido deletada ou o bot não tem permissão).`
      );
      return;
    }

    await message.edit({ embeds: [updatedEmbed] });
  } catch (error) {
    console.error(`Erro ao atualizar o evento ou remover usuário no banco de dados ${userTag}`, error);
  }
}
