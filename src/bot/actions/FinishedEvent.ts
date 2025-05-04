import { ChannelType, EmbedBuilder } from "discord.js";
import { FinishedEventType } from "./types";

export async function FinishedEvent({ prisma, keyTitle, message, embed }: FinishedEventType) {
  const event = await prisma.event.findFirst({
    where: {
      eventName: keyTitle,
    },
    include: {
      Participant: true,
    },
  });

  const guildData = await prisma.guilds.findUnique({
    where: {
      guildID: message?.guild?.id,
    },
  });

  if (!event) {
    return console.error("Evento não existe!");
  }

  //atualizar o id, messageId e status do eventChannel
  await prisma.event.update({
    where: {
      id: event.id,
    },
    data: {
      status: "finished",
    },
  });

  const eventChannel = message.guild?.channels.cache.get(event?.channelID ?? "");

  if (!eventChannel || !eventChannel.isVoiceBased()) {
    console.error("Canal de voz do evento não encontrado ou não é um canal de voz!");
    return;
  }

  const participants = await prisma.participant.findMany({
    where: {
      eventId: event.id,
    },
  });

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

  const channelName = eventChannel.name;

  await eventChannel?.delete();

  const eventTextChannel = await message?.guild?.channels.create({
    name: channelName,
    type: ChannelType.GuildText,
    reason: `Canal de texto criado para o ${channelName} finalizado!`,
    parent: guildData?.endedCategoryID,
  });

  //atualizar embed

  const eventTotalTime = Date.now() - Number(event.startTime);

  const totalParticipantes = await prisma.participant.count({
    where: {
      eventId: event.id,
    },
  });

  const updateParticipantsTimes = participants.map((participant) => {
    const joinTime = Number(participant.joinTime);
    const totalTime = Number(participant.totalTime);
    const counter = joinTime ? Date.now() - joinTime : 0;

    const newTotalTime = totalTime + counter;

    const percentage = Math.min(100, Math.ceil((Number(newTotalTime) / eventTotalTime) * 100));

    return prisma.participant.update({
      where: {
        id: participant.id,
      },
      data: {
        totalTime: newTotalTime,
        percentage,
      },
    });
  });

  const updateParticipant = await prisma.$transaction(updateParticipantsTimes);

  const starTime = new Date(event.createdAt);
  const now = new Date();

  const durationInMilliseconds = now.getTime() - starTime.getTime();

  const durationInHours = Math.floor(durationInMilliseconds / (1000 * 60 * 60)); // Total de horas
  const durationInMinutes = Math.floor((durationInMilliseconds % (1000 * 60 * 60)) / (1000 * 60)); // Minutos restantes após as horas

  const participationList = updateParticipant
    .map((participant) => {
      const userMention = `<@${participant.userId}>`;

      return `${userMention} : ${participant.percentage}%`;
    })
    .join("\n");

  await Promise.all([message.reactions.cache.get("⏸")?.remove(), message.reactions.cache.get("🚀")?.remove()]);

  const creator = await message.client.users.fetch(event.creatorId);

  try {
    const updatedEmbed = new EmbedBuilder()
      .setTitle(`${keyTitle} - Criado por ${creator.username}`)
      .addFields(
        embed.fields
          .filter((field) => field.name !== "Passos para o Criador e Administrador do evento")
          .map((field) => {
            if (field.name === "Participantes") {
              return {
                ...field,
                value: participationList,
              };
            }

            if (field.name === "ID do Evento") {
              return {
                ...field,
                name: "Vendedor",
                value: "Nenhum vendedor",
              };
            }

            if (field.name === "Criador") {
              return {
                ...field,
                name: "Total Participantes",
                value: `${totalParticipantes}`,
              };
            }

            if (field.name === "Qnt Participantes") {
              return {
                ...field,
                name: "Duração",
                value: `${durationInHours}h ${durationInMinutes}m`,
              };
            }

            return field;
          })
      )
      .setColor("DarkButNotBlack");

    const newActionEmbed = new EmbedBuilder();
    newActionEmbed.setTitle("Oque fazer agora?");
    newActionEmbed.setFields(
      {
        name: "Vincule um vendedor para gerenciar o evento",
        value: `\n\n\`/vendedor @membro\``,
      },
      {
        name: "Para simular o valor que cada participante recebera,utilize o comando:",
        value: `\n\`/simular-evento 1,000,000\``,
      },
      {
        name: "As simulações podem ser feitas várias vezes.\n\nPara ajustar a participação de um membro específico, utilize o comando:\n",
        value: `\n\`/atualizar-participacao @membro 100\``,
      }
    );
    newActionEmbed.setColor("DarkButNotBlack");

    const sendEventNewChannel = await eventTextChannel?.send({
      embeds: [updatedEmbed],
    });
    await eventTextChannel?.send({
      embeds: [newActionEmbed],
    });

    //atualizar o id, messageId e status do eventChannel
    await prisma.event.update({
      where: {
        id: event.id,
      },
      data: {
        channelID: eventTextChannel?.id,
        messageID: sendEventNewChannel?.id,
      },
    });

    await message.delete();
  } catch (error) {
    console.log("error aqui", error);
  }
}
