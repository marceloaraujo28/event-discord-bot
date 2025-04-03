import { RemoveBotType } from "../types";

export async function RemoveBot({ interaction, prisma }: RemoveBotType) {
  await interaction.deferReply();
  try {
    const guild = interaction.guild;

    if (!guild) return await interaction.editReply("Não foi possível encontrar a guild!");

    //buscar info da guild no banco
    const guildData = await prisma.guilds.findUnique({
      where: {
        guildID: guild.id,
      },
    });

    if (!guildData) {
      return await interaction.editReply("Nenhuma configuração encontrada para este servidor.");
    }

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
    await prisma.guilds.delete({ where: { guildID: guild.id } });
    await prisma.event.deleteMany({ where: { guildId: guild.id } });

    if (!interaction.channel) {
      return await interaction.user.send(
        "O bot foi removido com sucesso! Todos os canais, cargos e eventos foram excluídos."
      );
    } else {
      return await interaction.editReply(
        "O bot foi removido com sucesso! Todos os canais, cargos e eventos foram excluídos."
      );
    }
  } catch (error) {
    console.error(`Erro ao remover o bot na guild ${interaction.guild?.name}:${interaction.guildId}, ${error}`);
  }
}
