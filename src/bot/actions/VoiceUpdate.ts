import { EmbedBuilder } from "discord.js";
import { VoiceUpdateType } from "./types";

export async function VoiceUpdate({
  newState,
  oldState,
  prisma,
}: VoiceUpdateType) {
  if (!oldState.channel) {
    return;
  }
  const channel = await oldState?.channel.fetch();
  const findMessages = await channel?.messages.fetch();
  const messageContent = findMessages?.map((message) => {
    return message;
  })?.[0];
  const embed = messageContent?.embeds[0];

  //logica para verificar se o usuario saiu da salas
  //quando o usuario sair da sala o oldState.channelId ira existir e será diferente do newState.channelIds
  if (oldState.channelId && oldState.channelId !== newState.channelId) {
    if (embed) {
      const userId = oldState?.member?.user.id;
      const userTag = `<@${userId}>`;
      const eventNumberMatch = embed.title?.match(/Evento (\d+) -/);
      const eventNumber = eventNumberMatch?.[1] || "";
      const keyTitle = `Evento ${eventNumber}`;

      const event = await prisma.event.findFirst({
        where: {
          eventName: keyTitle,
        },
      });

      const participant = await prisma.participant.findFirst({
        where: {
          userId,
        },
      });

      //logica para fazer a contagem do tempo que o usuario ficou depois de sair do evento
      if (userId && event && participant) {
        //remover do banco
        try {
          const joinTime = Number(participant.joinTime);
          const totalTime = Number(participant.totalTime);
          const counter = joinTime ? Date.now() - joinTime : 0;
          const [updateParticipant, participantCount] =
            await prisma.$transaction([
              prisma.participant.update({
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
              }),
              prisma.participant.count({
                where: {
                  eventId: event.id,
                },
              }),
            ]);

          //remover da lista de participantes no embed

          const participants =
            embed.fields.find((text) => text.name === "Participantes")?.value ||
            "Nenhum participant";

          const updateParticipants = participants
            .split("\n")
            .filter((line) => line.trim() !== userTag)
            .join("\n");

          const updatedEmbed = new EmbedBuilder();
          updatedEmbed.setTitle(embed.title);
          updatedEmbed.addFields(
            embed.fields.map((field) => {
              if (field.name === "Participantes") {
                return {
                  ...field,
                  value:
                    updateParticipants.length > 0
                      ? updateParticipants
                      : "Nenhum participante",
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

          await messageContent.edit({ embeds: [updatedEmbed] });

          console.log("Usuário saiu da sala e do evento: ", updateParticipant);
        } catch (error) {
          console.error(
            `Erro ao atualizar o evento ou remover usuário no banco de dados ${userTag}`,
            error
          );
        }
      } else {
        console.error(`Usuário ${userTag} não encontrado para o ${keyTitle}`);
      }
    }
  }
}
