import { EmbedBuilder } from "discord.js";
import { ParticipateEventType } from "./types";
import { sendMessageChannel } from "../utils/sendMessageChannel";
import { useT } from "../utils/useT";

export const ParticipateEvent = async ({
  reaction,
  user,
  prisma,
  message,
  embed,
  eventNumber,
  keyTitle,
  guildData,
}: ParticipateEventType) => {
  const guild = message.guild;
  const language = guildData.language;
  const t = useT(language);

  let member;

  try {
    member = await guild?.members.fetch(user.id);
    await reaction.users.remove(user.id);
  } catch (error) {
    return console.error("Erro ao buscar member ou remover reação do usuário!");
  }

  const userMention = `<@${user.id}>`;

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

    const eventVoiceChannel = guild?.channels.cache.get(event.channelID ?? "");

    //verifica se o usuário está em algum canal de voz
    if (!member?.voice.channel) {
      await sendMessageChannel({
        channelID: guildData?.logsChannelID,
        messageChannel: t("participateEvent.messageChannel", {
          userId: user.id,
        }),
        guild,
      });
      return;
    }

    if (embed) {
      const embedFields = [...embed.fields];
      const participants = embed.fields[3].value;

      if (participants.includes(user.id)) {
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
      const isDefaultMessage = !participants.includes("<@");
      const updateParticipants = isDefaultMessage ? userMention : `${participants}\n${userMention}`;

      embedFields[3] = {
        ...embedFields[3],
        value: updateParticipants,
      };

      embedFields[2] = {
        ...embedFields[2],
        value: `${participantCount}`,
      };

      const updatedEmbed = new EmbedBuilder()
        .setTitle(embed.title)
        .addFields(embedFields)
        .setDescription(embed.description)
        .setColor(embed.color);

      await message.edit({ embeds: [updatedEmbed] });

      //puxar o usuário para a sala do evento caso ele não esteja na sala ainda
      //isso evita de o usuário estar participando do evento a partir de outra sala
      if (eventVoiceChannel && eventVoiceChannel.isVoiceBased()) {
        await member?.voice.setChannel(eventVoiceChannel);
      }
    }
  } catch (error) {
    console.error(`Erro ao adicionar o participante no evento`, error);
    return await reaction.message.reply(
      t("participateEvent.catchError", {
        userMention,
      })
    );
  }
};
