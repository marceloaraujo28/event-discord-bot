import { ChannelType, EmbedBuilder } from "discord.js";
import { FinishedEventType } from "./types";
import { useT } from "../utils/useT";

export async function FinishedEvent({
  prisma,
  keyTitle,
  message,
  embed,
  reaction,
  user,
  guildData,
}: FinishedEventType) {
  const language = guildData.language;
  const t = useT(language);

  try {
    await reaction.users.remove(user.id);

    const event = await prisma.event.findFirst({
      where: {
        eventName: keyTitle,
      },
      include: {
        Participant: true,
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

    const creatorName = embed.fields[1].value;

    const embedValues = [...embed.fields];

    //removendo o passo a passo do embed
    embedValues.splice(4, 1);

    //participantes
    embedValues[3] = {
      ...embedValues[3],
      name: t("finishedEvent.embed.participants"),
      value: participationList,
    };

    //vendedor
    embedValues[0] = {
      ...embedValues[0],
      name: t("finishedEvent.embed.seller"),
      value: t("finishedEvent.embed.sellerValue"),
    };

    //total participantes
    embedValues[2] = {
      ...embedValues[2],
      name: t("finishedEvent.embed.totalParticipants"),
      value: `${totalParticipantes}`,
    };

    //duração
    embedValues[1] = {
      ...embedValues[1],
      name: t("finishedEvent.embed.duration"),
      value: `${durationInHours}h ${durationInMinutes}m`,
    };

    const updatedEmbed = new EmbedBuilder()
      .setTitle(
        t("finishedEvent.embed.title", {
          eventTitle: keyTitle,
          username: creatorName,
        })
      )
      .addFields(embedValues)
      .setColor("DarkButNotBlack");

    const newActionEmbed = new EmbedBuilder();
    newActionEmbed.setTitle(t("finishedEvent.informationEmbed.title"));
    newActionEmbed.setFields(
      {
        name: t("finishedEvent.informationEmbed.sellerTitle"),
        value: t("finishedEvent.informationEmbed.sellerValue"),
      },
      {
        name: t("finishedEvent.informationEmbed.simulateTitle"),
        value: t("finishedEvent.informationEmbed.simulateValue"),
      },
      {
        name: t("finishedEvent.informationEmbed.updateTitle"),
        value: t("finishedEvent.informationEmbed.updateValue"),
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
    console.error(`${user.username}, Erro ao finalizar o ${keyTitle}`, error);
  }
}
