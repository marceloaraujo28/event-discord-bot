import { EmbedBuilder } from "discord.js";
import { UpdateSellerFeeType } from "../types";

export async function UpdateSellerFee({ interaction, prisma }: UpdateSellerFeeType) {
  await interaction.deferReply();

  try {
    if (!interaction.guildId) {
      return interaction.editReply("Erro ao atualizar a taxa, guild id não existe!");
    }

    const sellerFee = interaction.options.get("taxa")?.value;

    const updatedFee = await prisma.guilds.update({
      where: {
        guildID: interaction.guildId,
      },
      data: {
        sellerFee: Number(sellerFee),
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
      return console.log("Canal de eventos não encontrado para atualização da taxa do vendedor!");
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
        field.name === "Taxa do vendedor" ? { ...field, value: `${updatedFee.sellerFee}%` } : field
      ) ?? []
    );

    await message.edit({ embeds: [updatedEmbed] });

    return interaction.editReply(
      `<@${interaction.user.id}> atualizou a taxa do vendedor para ${updatedFee.sellerFee}%`
    );
  } catch (error) {
    console.error(
      `Erro ao atualizar a taxa do vendedor no servidor: ${interaction.guild?.name} ${interaction.guildId}`
    );
    return;
  }
}
