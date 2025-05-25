import { ArchiveEventType } from "../types";
import { EmbedBuilder } from "discord.js";
import { sendMessageChannel } from "../../utils/sendMessageChannel";
import { useT } from "../../utils/useT";

export async function ArchiveEvent({ interaction, guildData, prisma }: ArchiveEventType) {
  await interaction.deferReply();

  const language = guildData.language;
  const t = useT(language);

  try {
    const event = await prisma.event.findFirst({
      where: {
        channelID: interaction.channelId,
      },
    });

    if (!event || (event.status !== "closed" && event.status !== "finished")) {
      return await interaction.editReply(t("archiveEvent.eventNotFinished"));
    }

    if (!event.simulatedMessageID) {
      return await interaction.editReply(t("archiveEvent.eventNotSimulated"));
    }

    if (!event.messageID) {
      return await interaction.editReply(t("archiveEvent.embedNotFound"));
    }

    const message = await interaction.channel?.messages.fetch(event.messageID);

    if (!message) {
      return await interaction.editReply(t("archiveEvent.messagesNotFound"));
    }

    if (!message.embeds || message.embeds.length === 0) {
      return await interaction.editReply(t("archiveEvent.messageNotContainsEmbeds"));
    }

    const embed = message.embeds[0];

    if (!embed) {
      return await interaction.editReply(t("archiveEvent.eventEmbedNotFound"));
    }

    if (!guildData.financialChannelID) {
      return await interaction.editReply(t("archiveEvent.financialChannelDataBaseNotFound"));
    }

    const financialChannel =
      interaction.guild?.channels.cache.get(guildData.financialChannelID) ||
      (await interaction.guild?.channels.fetch(guildData.financialChannelID).catch(() => null));

    if (!financialChannel || !financialChannel.isTextBased()) {
      return await interaction.editReply(t("archiveEvent.financialChannelNotFound"));
    }

    const originalEmbed = embed.toJSON();
    let creatorName;

    try {
      const user = await interaction.client.users.fetch(event.creatorId);
      creatorName = user.username;
    } catch (error) {
      console.error("Erro ao buscar o criador do evento:", error);
    }

    // Copia todos os fields existentes
    const updatedFields = originalEmbed.fields ?? [];

    // Adiciona o novo campo no final
    updatedFields.push({
      name: t("archiveEvent.totalValue"),
      value: `${event.totalValue?.toLocaleString("en-US")}`,
      inline: false,
    });

    const title = creatorName
      ? t("archiveEvent.eventName1", {
          eventName: event.eventName,
          creatorName,
        })
      : t("archiveEvent.eventName2", {
          eventName: event.eventName,
        });

    const newEmbed = new EmbedBuilder({
      ...originalEmbed,
    }).setTitle(title);

    await sendMessageChannel({
      messageChannel: {
        embeds: [newEmbed],
      },
      channelID: guildData.financialChannelID,
      guild: interaction.guild,
    });

    await interaction.editReply(t("archiveEvent.successArchive"));

    return await interaction.channel?.delete();
  } catch (error) {
    console.error("Erro ao arquivar evento:", error);
    await interaction.editReply(t("archiveEvent.catchError"));
  }
}
