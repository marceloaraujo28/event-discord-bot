import { ChannelType, EmbedBuilder } from "discord.js";
import { FinishedEventType } from "./types";

export async function FinishedEvent({
  prisma,
  keyTitle,
  message,
  embed,
}: FinishedEventType) {
  const event = await prisma.event.findFirst({
    where: {
      eventName: keyTitle,
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

  const eventChannel = message.guild?.channels.cache.get(
    event?.channelID ?? ""
  );

  if (!eventChannel || !eventChannel.isVoiceBased()) {
    console.error(
      "Canal de voz do evento não encontrado ou não é um canal de voz!"
    );
    return;
  }

  const members = eventChannel.members;
  // Buscar o canal de espera (waitingVoiceChannelID)
  const waitingVoiceChannel = message.guild?.channels.cache.get(
    guildData?.waitingVoiceChannelID ?? ""
  );

  if (waitingVoiceChannel && waitingVoiceChannel.isVoiceBased()) {
    // Transferir cada membro para a sala de espera
    for (const [memberId, member] of members) {
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

  await prisma.event.update({
    data: {
      status: "finished",
    },
    where: {
      id: event.id,
    },
  });

  const participants = await prisma.participant.findMany({
    where: {
      eventId: event.id,
    },
  });

  const updateParticipantsTimes = participants.map((participant) => {
    const joinTime = Number(participant.joinTime);
    const totalTime = Number(participant.totalTime);
    const counter = joinTime ? Date.now() - joinTime : 0;

    return prisma.participant.update({
      where: {
        id: participant.id,
      },
      data: {
        joinTime: null,
        totalTime: totalTime + counter,
      },
    });
  });

  const updateParticipant = await prisma.$transaction(updateParticipantsTimes);

  const participationList = updateParticipant
    .map((participant) => {
      const percentage = Math.min(
        100,
        Math.ceil((Number(participant.totalTime) / eventTotalTime) * 100)
      );

      const userMention = `<@${participant.userId}>`;

      return `${userMention} : ${percentage}%`;
    })
    .join("\n");

  await Promise.all([
    message.reactions.cache.get("⏸")?.remove(),
    message.reactions.cache.get("✅")?.remove(),
  ]);

  const updatedEmbed = new EmbedBuilder()
    .setTitle(`${keyTitle} - Finalizado!`)
    .addFields(
      embed.fields.map((field) => {
        if (field.name === "Participantes") {
          return {
            ...field,
            value: participationList,
          };
        }

        return field;
      })
    )
    .setDescription(embed.description)
    .setColor("DarkGrey");

  await eventTextChannel?.send({ embeds: [updatedEmbed] });

  await message.delete();
}
