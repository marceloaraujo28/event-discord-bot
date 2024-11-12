import { EmbedBuilder, ChannelType } from "discord.js";
import { OpenEventType } from "./types";

export const OpenEvent = async ({
  eventCounter,
  interaction,
  eventStore,
}: OpenEventType) => {
  const channelName = `event-${eventCounter}`;
  const guild = interaction.guild;

  try {
    //Criação do canal

    const eventChannel = await guild?.channels.create({
      name: channelName,
      type: ChannelType.GuildVoice,
      reason: `Canal criado para o Evento ${eventCounter}`,
    });

    // Criação do embed

    const embed = await new EmbedBuilder();
    embed.setTitle(
      `Evento ${eventCounter} - Criado por ${interaction.user.username}`
    );
    embed.setDescription("Evento não iniciado");
    embed.addFields(
      {
        name: "ID do Evento",
        value: `${eventCounter}`,
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

    const keyTitle = `Evento ${eventCounter}`;

    // Iniciando o array vazio (esse array faz o controle da entrada e saída dos usuários)

    if (!eventStore[keyTitle]) {
      eventStore[keyTitle] = {};
    }

    // Enviando embed para o canal criado

    const eventMessage = await eventChannel?.send({ embeds: [embed] });

    // Adiciona reações automaticamente
    await eventMessage?.react("✅"); // Reação para participar
    await eventMessage?.react("🏌️‍♀️"); // Reação para começar o evento
    await eventMessage?.react("🛑"); // Reação para para o evento

    interaction.reply(
      `Evento ${eventCounter} Criado com sucesso pelo jogador <@${interaction.user.id}>`
    );
  } catch (error) {
    console.error(`Erro ao criar o canal:`, error);
    interaction.reply(`Falha ao criar evento`);
  }
};
