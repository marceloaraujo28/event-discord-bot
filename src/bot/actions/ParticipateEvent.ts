import { EmbedBuilder } from "discord.js";
import { ParticipateEventType } from "./types";
import { sendMessageChannel } from "../utils/sendMessageChannel";

export const ParticipateEvent = async ({
  reaction,
  user,
  prisma,
  message,
  embed,
  eventNumber,
  keyTitle,
}: ParticipateEventType) => {
  const guild = message.guild;
  const member = await guild?.members.fetch(user.id);
  const userMention = `<@${user.id}>`;

  await reaction.users.remove(user.id);

  const event = await prisma.event.findFirst({
    where: {
      eventName: keyTitle,
    },
  });

  const eventVoiceChannel = guild?.channels.cache.get(event?.channelID ?? "");

  const guildData = await prisma.guilds.findUnique({
    where: {
      guildID: guild?.id,
    },
  });
  //verifica se o usuário está em algum canal de voz
  if (!member?.voice.channel) {
    await sendMessageChannel({
      channelID: guildData?.logsChannelID,
      messageChannel: `<@${user.id}> você precisa estar em um canal de voz para poder participar de um evento!`,
      guild,
    });
    return;
  }

  if (embed) {
    const currentParticipants =
      embed.fields.find((field) => field.name === "Participantes")?.value || "Nenhum participante";

    if (!currentParticipants.includes(user.id)) {
      try {
        const event = await prisma.event.findFirst({
          where: {
            eventName: keyTitle,
          },
          include: {
            Participant: true,
          },
        });

        if (!event) {
          console.error(`Evento com o número ${eventNumber} não encontrado`);
          return;
        }

        //status do evento
        const status = event?.status;

        //cadastrando user no banco de dados caso não exista
        const userTable = await prisma.user.findUnique({
          where: {
            userId_guildID: {
              guildID: guild?.id ?? "",
              userId: user.id,
            },
          },
        });

        if (!userTable) {
          await prisma.user.create({
            data: {
              userId: user.id,
              guildID: guild?.id ?? "",
            },
          });
        }

        const [participant, participantCount] = await prisma.$transaction([
          prisma.participant.upsert({
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
              guildID: guild?.id ?? "",
              eventId: event.id,
              joinTime: status === "pending" ? null : Date.now(),
              totalTime: 0,
            },
            include: {
              event: true,
            },
          }),
          prisma.participant.count({
            where: {
              eventId: event.id,
            },
          }),
        ]);

        //se não tiver nenhum participante ele apenas adiciona no campo, se não, ele pega todos os outros participantes e adiciona mais esse
        const updateParticipants =
          currentParticipants === "Nenhum participante" ? userMention : `${currentParticipants}\n${userMention}`;

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

              if (field.name === "Qnt Participantes") {
                return {
                  ...field,
                  value: `${participantCount}`,
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
        reaction.message.reply(`Erro ao adicionar o participante ${userMention} ao evento`);
      }
    }
  }
};
