import { EmbedBuilder } from "discord.js";
import { ParticipateEventType } from "./types";
import { PrismaClient } from "@prisma/client";

export const ParticipateEvent = async ({
  reaction,
  user,
  eventStore,
}: ParticipateEventType) => {
  const message = reaction.message;
  const guild = message.guild;
  const member = await guild?.members.fetch(user.id);
  const eventVoiceChannel = guild?.channels.cache.get(message.channelId);
  const embed = message.embeds[0];
  const userMention = `<@${user.id}>`;

  const eventNumberMatch = embed.title?.match(/Evento (\d+) -/);
  const eventNumber = eventNumberMatch?.[1] || "";
  const keyTitle = `Evento ${eventNumber}`;

  const prisma = new PrismaClient();

  await reaction.users.remove(user.id);
  //verifica se o usuário está em algum canal de voz
  if (!member?.voice.channel) {
    return console.error("O usuário não está conectado a nenhum canal de voz.");
  }

  if (embed) {
    const currentParticipants =
      embed.fields.find((field) => field.name === "Participantes")?.value ||
      "Nenhum participante";

    if (!currentParticipants.includes(user.id)) {
      try {
        const event = await prisma.event.findFirst({
          where: {
            eventName: keyTitle,
          },
        });

        //status do evento
        const status = event?.status;

        if (!event) {
          console.error(`Evento com o número ${eventNumber} não encontrado`);
          return;
        }

        const participant = await prisma.participant.upsert({
          where: {
            userId_eventId: {
              eventId: event.id,
              userId: user.id,
            },
          },
          update: {
            joinTime: status === "pending" ? null : Date.now(),
          },
          create: {
            userId: user.id,
            eventId: event.id,
            joinTime: status === "pending" ? null : Date.now(),
            totalTime: 0,
          },
        });

        console.log(
          participant.id
            ? `Participante entrou novamente no evento`
            : `Novo participante adicionado ao evento`,
          participant
        );

        //se não tiver nenhum participante ele apenas adiciona no campo, se não, ele pega todos os outros e adiciona mais esse
        const updateParticipants =
          currentParticipants === "Nenhum participante"
            ? userMention
            : `${currentParticipants}\n${userMention}`;

        const updatedEmbed = new EmbedBuilder()
          .setTitle(embed.title)
          .addFields(
            embed.fields.map((field) => {
              if (field.name === "Participantes") {
                return {
                  ...field,
                  value: updateParticipants,
                };
              }

              return field;
            })
          )
          .setDescription(embed.description)
          .setColor(embed.color);

        await message.edit({ embeds: [updatedEmbed] });

        //puxar o usuário para a sala do evento caso ele não esteja na sala ainda
        //isso evita de o usuário estar participando do evento a partir de outra sala
        if (eventVoiceChannel && eventVoiceChannel.isVoiceBased()) {
          await member?.voice.setChannel(eventVoiceChannel);
        }
      } catch (error) {
        console.error(`Erro ao adicionar o participante no evento`, error);
        reaction.message.reply(
          `Erro ao adicionar o participante ${userMention} ao evento`
        );
      }
    }
  }
};
