import { EmbedBuilder } from "discord.js";
import { UpdateGuildFeeType } from "../types";

export async function UpdateGuildFee({ interaction, prisma }: UpdateGuildFeeType) {
  await interaction.deferReply();

  try {
    if (!interaction.guildId) {
      return interaction.editReply("Erro ao atualizar a taxa, guild id não existe!");
    }

    const guildFee = interaction.options.get("taxa")?.value;

    const updatedFee = await prisma.guilds.update({
      where: {
        guildID: interaction.guildId,
      },
      data: {
        guildFee: Number(guildFee),
      },
    });

    if (!updatedFee) {
      return await interaction.editReply("Digite um valor valido!");
    }

    // Busca os dados da guild para pegar o canal do evento
    const guildInfo = await prisma.guilds.findUnique({
      where: { guildID: interaction.guildId },
    });

    if (!guildInfo?.newEventChannelID) {
      return console.log("Canal de eventos não encontrado para atualização da taxa do vendedor!");
    }

    // Obtém o canal onde está o embed
    const channel = await interaction.guild?.channels.fetch(guildInfo.newEventChannelID);
    if (!channel?.isTextBased()) {
      return console.log("Canal de eventos não encontrado para atualização da taxa da guild!");
    }

    const messages = await channel?.messages.fetch({ after: "0", limit: 1 });
    const message = messages?.first();

    const embed = message?.embeds[0];

    if (!embed) {
      return console.log("Erro: Não foi possível encontrar o embed de criação de eventos.");
    }

    const updatedEmbed = new EmbedBuilder(embed.toJSON());

    updatedEmbed.setFields(
      updatedEmbed.data.fields?.map((field) =>
        field.name === "Taxa da guild" ? { ...field, value: `${updatedFee.guildFee}%` } : field
      ) ?? []
    );

    await message.edit({ embeds: [updatedEmbed] });

    return interaction.editReply(`<@${interaction.user.id}> atualizou a taxa da guild para ${updatedFee.guildFee}%`);
  } catch (error) {
    console.error(`Erro ao atualizar a taxa da guild no servidor: ${interaction.guild?.name} ${interaction.guildId}`);
    return;
  }
}
