import { EmbedBuilder, ChannelType } from "discord.js";
import { OpenEventType } from "./types";
import { sendMessageChannel } from "../utils/sendMessageChannel";
import { isInCooldown, setCooldown } from "../utils/cooldown";
import { useT } from "../utils/useT";

export const OpenEvent = async ({ interaction, guildData, prisma }: OpenEventType) => {
  const guild = interaction.guild;

  const language = guildData.language;
  const t = useT(language);

  if (isInCooldown(interaction.user.id)) {
    console.log(`Usuário ${interaction.user.username}:${interaction.user.id} está em cooldown.`);
    return;
  }

  setCooldown(interaction.user.id);

  let member;

  try {
    member = await guild?.members.fetch(interaction.user.id);

    if (!member?.voice.channel) {
      await sendMessageChannel({
        channelID: guildData?.logsChannelID,
        messageChannel: t("openEvent.notInChannel", {
          interactionUser: interaction.user.id,
        }),
        guild,
      });
      return;
    }
  } catch (error) {
    console.error("Erro ao buscar usuário: ", error);
  }

  try {
    //consultando ultimo evento para criar o numero do evento

    const updatedCounter = await prisma.globalEventCounter.upsert({
      where: { id: 1 }, // Tentando encontrar o registro com id 1
      update: { lastNumber: { increment: 1 } }, // Atualiza o valor de `lastNumber` se encontrado
      create: { id: 1, lastNumber: 1 }, // Cria um novo registro se não existir
    });

    //Criação do canal
    const eventNumber = updatedCounter.lastNumber;

    const eventChannel = await guild?.channels.create({
      name: `event-${eventNumber}`,
      type: ChannelType.GuildVoice,
      reason: `Canal criado para o Evento ${eventNumber}`,
      parent: guildData?.startedCategoryID,
    });

    // Criação do embed

    const embed = await new EmbedBuilder();
    embed.setTitle(
      t("openEvent.embed.title", {
        eventNumber,
        userName: interaction.user.username,
      })
    );
    embed.setDescription(t("openEvent.embed.description"));
    embed.addFields(
      {
        name: "ID do Event",
        value: `${updatedCounter.lastNumber}`,
        inline: true,
      },
      {
        name: t("openEvent.embed.author"),
        value: `${interaction.user.username}`,
        inline: true,
      },
      {
        name: t("openEvent.embed.totalPlayers"),
        value: "1",
        inline: true,
      },
      {
        name: t("openEvent.embed.participants"),
        value: `<@${interaction.user.id}>`,
      },
      {
        name: t("openEvent.embed.instructionsTitle"),
        value: t("openEvent.embed.instructionsValue"),
      }
    );
    embed.setColor("Blurple");

    // Enviando embed para o canal de participar do evento
    const participationChannel = guild?.channels.cache.get(guildData?.participationChannelID ?? "");

    if (participationChannel?.isTextBased()) {
      const eventMessage = await participationChannel?.send({
        embeds: [embed],
      });
      // Adiciona reações automaticamente
      await eventMessage?.react("🚀"); // Reação para participar
      await eventMessage?.react("🏁"); // Reação para começar o evento
      await eventMessage?.react("🛑"); // Reação para para o evento

      //criando evento no banco de dados
      const newEvent = await prisma.event.create({
        data: {
          creatorId: interaction.user.id,
          eventName: `Event ${eventNumber}`,
          guildId: guild?.id ?? "",
          messageID: eventMessage.id,
          createdAt: new Date(),
          channelID: eventChannel?.id,
        },
      });

      //adicionando participante inicial na tabela User
      const user = await prisma.user.findUnique({
        where: {
          userId_guildID: {
            guildID: interaction.guild?.id ?? "",
            userId: interaction.user.id,
          },
        },
      });

      if (!user) {
        await prisma.user.create({
          data: {
            userId: interaction.user.id,
            guildID: interaction.guild?.id ?? "",
          },
        });
      }

      //adicionando o usuário que criou o evento no banco de dados do evento
      await prisma.participant.create({
        data: {
          userId: interaction.user.id,
          guildID: interaction.guild?.id ?? "",
          eventId: newEvent.id,
          joinTime: null,
          totalTime: 0,
        },
      });
    }

    sendMessageChannel({
      channelID: guildData?.logsChannelID,
      messageChannel: t("openEvent.eventCreated", {
        eventNumber,
        userId: interaction.user.id,
      }),
      guild,
    });

    //puxar o usuário para a sala do evento caso ele não esteja na sala ainda
    //isso evita de o usuário estar participando do evento a partir de outra sala
    if (eventChannel && eventChannel.isVoiceBased()) {
      await member?.voice.setChannel(eventChannel);
    }
  } catch (error) {
    console.error(`Erro ao criar o evento:`, error);
    sendMessageChannel({
      channelID: guildData?.logsChannelID,
      messageChannel: t("openEvent.errorCreatedEvent"),
      guild,
    });
    return await interaction.reply(t("openEvent.errorReply"));
  }
};
