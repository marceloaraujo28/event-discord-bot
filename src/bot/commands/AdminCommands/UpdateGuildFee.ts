import { EmbedBuilder } from "discord.js";
import { UpdateGuildFeeType } from "../types";
import { useT } from "../../utils/useT";

export async function UpdateGuildFee({ interaction, prisma, guildData }: UpdateGuildFeeType) {
  await interaction.deferReply();

  const language = guildData.language;

  const t = useT(language);

  try {
    if (!interaction.guildId) {
      return interaction.editReply(t("updateGuildFee.noGuild"));
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
      return await interaction.editReply(t("updateGuildFee.noFee"));
    }

    // Busca os dados da guild para pegar o canal do evento
    const guildInfo = await prisma.guilds.findUnique({
      where: { guildID: interaction.guildId },
    });

    if (!guildInfo?.newEventChannelID) {
      return interaction.editReply(t("updateGuildFee.eventChannelNotFound"));
    }

    // Obtém o canal onde está o embed
    const channel = await interaction.guild?.channels.fetch(guildInfo.newEventChannelID);
    if (!channel?.isTextBased()) {
      return interaction.editReply(t("updateGuildFee.eventChannelNotFound2"));
    }

    const messages = await channel?.messages.fetch({ after: "0", limit: 1 });
    const message = messages?.first();

    const embed = message?.embeds[0];

    if (!embed) {
      return interaction.editReply(t("updateGuildFee.embedNotFound"));
    }

    const updatedEmbed = new EmbedBuilder(embed.toJSON());

    const fields = updatedEmbed.data.fields ?? [];

    fields[1] = {
      ...fields[1],
      value: `${updatedFee.guildFee}%`,
    };

    updatedEmbed.setFields(fields);

    await message.edit({ embeds: [updatedEmbed] });

    return interaction.editReply(
      t("updateGuildFee.updateSuccess", { userId: interaction.user.id, guildFee: updatedFee.guildFee })
    );
  } catch (error) {
    console.error(
      `Erro ao atualizar a taxa da guild no servidor: ${interaction.guild?.name} ${interaction.guildId}`,
      error
    );
    return await interaction.editReply(t("updateGuildFee.updateError"));
  }
}
