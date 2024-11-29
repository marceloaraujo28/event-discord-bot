import { EmbedBuilder, ChannelType } from "discord.js";
import { OpenEventType } from "./types";
import { PrismaClient } from "@prisma/client";
import { sendMessageChannel } from "../utils/sendMessageChannel";

export const OpenEvent = async ({ interaction }: OpenEventType) => {
  const guild = interaction.guild;
  const prisma = new PrismaClient();
  const member = await guild?.members.fetch(interaction.user.id);

  const guildData = await prisma.guilds.findUnique({
    where: {
      guildID: guild?.id,
    },
  });

  if (!member?.voice.channel) {
    sendMessageChannel({
      channelID: guildData?.logsChannelID,
      messageChannel: `<@${interaction.user.id}> você precisa estar em um canal de voz para poder iniciar um evento!`,
      guild,
    });
    return;
  }

  try {
    //consultando ultimo evento para criar o numero do evento
    const lastEvent = await prisma.event.findFirst({
      orderBy: { id: "desc" },
    });

    const nextEventNumber = (lastEvent?.id ?? 0) + 1;

    //Criação do canal

    const eventChannel = await guild?.channels.create({
      name: `event-${nextEventNumber}`,
      type: ChannelType.GuildVoice,
      reason: `Canal criado para o Evento ${nextEventNumber}`,
      parent: guildData?.startedCategoryID,
    });

    //criando evento no banco de dados
    const newEvent = await prisma.event.create({
      data: {
        creatorId: interaction.user.id,
        eventName: `Evento ${nextEventNumber}`,
        createdAt: new Date(),
        channelID: eventChannel?.id,
      },
    });

    // Criação do embed

    const embed = await new EmbedBuilder();
    embed.setTitle(
      `Evento ${nextEventNumber} - Criado por ${interaction.user.username}`
    );
    embed.setDescription("Evento não iniciado");
    embed.addFields(
      {
        name: "ID do Evento",
        value: `${nextEventNumber}`,
        inline: true,
      },
      {
        name: "Criador",
        value: `${interaction.user.username}`,
        inline: true,
      },
      {
        name: "Qnt Participantes",
        value: "1",
        inline: true,
      },
      {
        name: "Participantes",
        value: `<@${interaction.user.id}>`,
      },
      {
        name: "Ações",
        value:
          "✅   Participar do evento\n\n🏌️‍♀️   Começar o Evento\n\n🛑  Cancelar o evento",
      }
    );
    embed.setColor("Blurple");

    //adicionando o usuário que criou o evento no banco de dados do evento
    await prisma.participant.create({
      data: {
        userId: interaction.user.id,
        eventId: newEvent.id,
        joinTime: null,
        totalTime: 0,
      },
    });

    // Enviando embed para o canal de participar do evento
    const participationChannel = guild?.channels.cache.get(
      guildData?.participationChannelID ?? ""
    );

    if (participationChannel?.isTextBased()) {
      const eventMessage = await participationChannel?.send({
        embeds: [embed],
      });
      // Adiciona reações automaticamente
      await eventMessage?.react("✅"); // Reação para participar
      await eventMessage?.react("🏌️‍♀️"); // Reação para começar o evento
      await eventMessage?.react("🛑"); // Reação para para o evento
    }

    sendMessageChannel({
      channelID: guildData?.logsChannelID,
      messageChannel: `Evento ${nextEventNumber} criado com sucesso pelo jogador <@${interaction.user.id}>`,
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
      messageChannel: `Erro ao criar o evento!`,
      guild,
    });
  }
};
