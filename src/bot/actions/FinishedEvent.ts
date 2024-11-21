import { EmbedBuilder } from "discord.js";
import { FinishedEventType } from "./types";

export async function FinishedEvent({
  prisma,
  keyTitle,
  message,
  user,
  embed,
}: FinishedEventType) {
  const event = await prisma.event.findFirst({
    where: {
      eventName: keyTitle, // Substituir pelo valor desejado
    },
  });

  if (!event) {
    return console.error("Evento não existe!");
  }

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

  await message.edit({ embeds: [updatedEmbed] });
}
