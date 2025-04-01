import { EmbedBuilder, ChannelType } from "discord.js";
import { OpenEventType } from "./types";
import { PrismaClient } from "@prisma/client";
import { sendMessageChannel } from "../utils/sendMessageChannel";

export const OpenEvent = async ({ interaction, guildData }: OpenEventType) => {
  const guild = interaction.guild;
  const prisma = new PrismaClient();
  const member = await guild?.members.fetch(interaction.user.id);

  if (!member?.voice.channel) {
    await sendMessageChannel({
      channelID: guildData?.logsChannelID,
      messageChannel: `<@${interaction.user.id}> você precisa estar em um canal de voz para poder iniciar um evento!`,
      guild,
    });
    return;
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
    embed.setTitle(`Evento ${eventNumber} Criado por ${interaction.user.username} - Não Iniciado!`);
    embed.setDescription(`Entre no evento reagindo com ${"🚀"} - (Necessário estar em um canal de voz no Discord)`);
    embed.addFields(
      {
        name: "ID do Evento",
        value: `${updatedCounter.lastNumber}`,
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
        name: "Passos para o Criador e Administrador do evento",
        value:
          "🏁-Iniciar o Evento (Começa a contabilizar o tempo e a participação dos jogadores)\n\n⏸Finalizar o evento (Finaliza e mostra a porcentagem da participação dos jogadores)\n\n🛑Cancelar o evento (Exclui o evento e salas criadas por ele - Apenas em eventos não iniciados)",
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
          eventName: `Evento ${eventNumber}`,
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
      messageChannel: `Evento ${eventNumber} criado com sucesso pelo jogador <@${interaction.user.id}>`,
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
    return await interaction.reply("Erro ao criar evento!");
  }
};
