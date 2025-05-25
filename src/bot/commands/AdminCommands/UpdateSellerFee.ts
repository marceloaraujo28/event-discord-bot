import { EmbedBuilder } from "discord.js";
import { UpdateSellerFeeType } from "../types";
import { useT } from "../../utils/useT";

export async function UpdateSellerFee({ interaction, prisma, guildData }: UpdateSellerFeeType) {
  await interaction.deferReply();

  const language = guildData.language;

  const t = useT(language);

  try {
    if (!interaction.guildId) {
      return interaction.editReply(t("updateSellerFee.noGuild"));
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
      return await interaction.editReply(t("updateSellerFee.noFee"));
    }

    // Busca os dados da guild para pegar o canal do evento
    const guildInfo = await prisma.guilds.findUnique({
      where: { guildID: interaction.guildId },
    });

    if (!guildInfo?.newEventChannelID) {
      return interaction.editReply(t("updateSellerFee.eventChannelNotFound"));
    }

    // Obtém o canal onde está o embed
    const channel = await interaction.guild?.channels.fetch(guildInfo.newEventChannelID);
    if (!channel?.isTextBased()) {
      return interaction.editReply(t("updateSellerFee.eventChannelNotFound2"));
    }

    const messages = await channel?.messages.fetch({ after: "0", limit: 1 });
    const message = messages?.first();

    const embed = message?.embeds[0];

    if (!embed) {
      return interaction.editReply(t("updateSellerFee.embedNotFound"));
    }

    const updatedEmbed = new EmbedBuilder(embed.toJSON());

    const fields = updatedEmbed.data.fields ?? [];

    fields[2] = {
      ...fields[2],
      value: `${updatedFee.sellerFee}%`,
    };

    updatedEmbed.setFields(fields);

    await message.edit({ embeds: [updatedEmbed] });

    return interaction.editReply(
      t("updateSellerFee.updateSuccess", {
        userId: interaction.user.id,
        sellerFee: updatedFee.sellerFee,
      })
    );
  } catch (error) {
    console.error(
      `Erro ao atualizar a taxa do vendedor no servidor: ${interaction.guild?.name} ${interaction.guildId}`
    );
    return await interaction.editReply(t("updateSellerFee.updateError"));
  }
}
