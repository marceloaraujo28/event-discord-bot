import { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } from "discord.js";
import { RemoveBotType } from "../types";
import { useT } from "../../utils/useT";

export async function RemoveBot({ interaction, prisma, guildData }: RemoveBotType) {
  await interaction.deferReply();
  const language = guildData.language;
  const t = useT(language);

  try {
    const guild = interaction.guild;

    if (!guild) return await interaction.editReply(t("removeBot.noGuild"));

    //buscar eventos
    const events = await prisma.event.findMany({
      where: { guildId: guild.id },
    });

    // Criar uma lista de canais para excluir (guild + eventos)
    const channelIdsToDelete = [
      guildData.newEventChannelID,
      guildData.participationChannelID,
      guildData.financialChannelID,
      guildData.logsChannelID,
      guildData.waitingVoiceChannelID,
      guildData.startedCategoryID,
      guildData.endedCategoryID,
      guildData.categoryID,
      guildData.checkBalanceID,
      ...events.map((event) => event.channelID),
    ].filter(Boolean); // Remove valores `null` ou `undefined`

    const validChannels = channelIdsToDelete.filter((id): id is string => id !== null);

    for (const channelId of validChannels) {
      try {
        const cachedChannel = guild.channels.cache.get(channelId);
        if (!cachedChannel) {
          console.warn(`Canal ${channelId} já foi deletado ou não existe.`);
          continue; // Pula para o próximo canal
        }

        const channel = await guild.channels.fetch(channelId);
        if (channel) await channel.delete();
      } catch (error) {
        console.error(`Erro ao excluir canal ${channelId}:`, error);
      }
    }

    // Excluir cargo de Event Manager, se existir
    if (guildData.eventManagerRoleID) {
      try {
        const cachedRole = guild.roles.cache.get(guildData.eventManagerRoleID);
        if (!cachedRole) {
          console.warn(`Cargo ${guildData.eventManagerRoleID} já foi deletado ou não existe.`);
        } else {
          const role = await guild.roles.fetch(guildData.eventManagerRoleID);
          if (role) await role.delete();
        }
      } catch (error) {
        console.error(`Erro ao excluir cargo ${guildData.eventManagerRoleID}:`, error);
      }
    }

    // Remover os dados do banco
    await Promise.all([
      prisma.guilds.delete({ where: { guildID: guild.id } }),
      prisma.event.deleteMany({ where: { guildId: guild.id } }),
    ]);

    const removedEmbed = new EmbedBuilder()
      .setTitle(t("removeBot.embed.title"))
      .setDescription(t("removeBot.embed.description"))
      .setColor("Red")
      .setFooter({ text: t("removeBot.embed.footer") })
      .setTimestamp();

    // Criar os botões
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      new ButtonBuilder()
        .setLabel(t("removeBot.titleLabel"))
        .setStyle(ButtonStyle.Link)
        .setURL("https://discord.gg/AjGZbc5b2s") // Substitua pelo seu link do Discord
    );

    if (!interaction.channel) {
      return await interaction.user.send({ embeds: [removedEmbed], components: [row] });
    } else {
      return await interaction.editReply({ embeds: [removedEmbed], components: [row] });
    }
  } catch (error) {
    console.error(`Erro ao remover o bot na guild ${interaction.guild?.name}:${interaction.guildId}, ${error}`);
    if (!interaction.channel) {
      return await interaction.user.send(t("removeBot.error"));
    } else {
      return await interaction.editReply(t("removeBot.error"));
    }
  }
}
