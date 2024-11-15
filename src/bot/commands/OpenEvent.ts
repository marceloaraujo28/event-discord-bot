import { EmbedBuilder, ChannelType } from "discord.js";
import { OpenEventType } from "./types";
import { PrismaClient } from "@prisma/client";

export const OpenEvent = async ({
  eventCounter,
  interaction,
  eventStore,
}: OpenEventType) => {
  const guild = interaction.guild;

  const prisma = new PrismaClient();

  try {
    //consultando ultimo evento para criar o numero do evento
    const lastEvent = await prisma.event.findFirst({
      orderBy: { id: "desc" },
    });

    const nextEventNumber = (lastEvent?.id ?? 0) + 1;

    //criando evento no banco de dados
    const newEvent = await prisma.event.create({
      data: {
        creatorId: interaction.user.id,
        eventName: `Evento ${nextEventNumber}`,
        createdAt: new Date(),
      },
    });

    console.log("Evento criado: ", newEvent);

    //Criação do canal

    const eventChannel = await guild?.channels.create({
      name: `event-${nextEventNumber}`,
      type: ChannelType.GuildVoice,
      reason: `Canal criado para o Evento ${nextEventNumber}`,
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
        value: `Nenhum participante`,
      },
      {
        name: "Ações",
        value:
          "✅   Participar do evento\n\n🏌️‍♀️   Começar o Evento\n\n🛑  Cancelar o evento",
      }
    );
    embed.setColor("Blurple");

    // Enviando embed para o canal criado

    const eventMessage = await eventChannel?.send({ embeds: [embed] });

    // Adiciona reações automaticamente
    await eventMessage?.react("✅"); // Reação para participar
    await eventMessage?.react("🏌️‍♀️"); // Reação para começar o evento
    await eventMessage?.react("🛑"); // Reação para para o evento

    interaction.reply(
      `Evento ${nextEventNumber} Criado com sucesso pelo jogador <@${interaction.user.id}>`
    );
  } catch (error) {
    console.error(`Erro ao criar o canal:`, error);
    interaction.reply(`Falha ao criar evento`);
  }
};
