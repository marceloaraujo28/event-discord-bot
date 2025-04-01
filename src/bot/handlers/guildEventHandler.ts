import { GuildEventType } from "./types";

export async function handleGuildEvents({ client, prisma }: GuildEventType) {
  try {
    // Buscar todas as guildas configuradas no banco de dados
    const allGuildConfigs = await prisma.guilds.findMany();

    // Buscar apenas eventos com status 'pending' ou 'started'
    const events = await prisma.event.findMany({
      where: {
        status: {
          in: ["pending", "started"], // Filtra apenas os eventos com esses status
        },
      },
    });

    // Guildas que têm eventos ativos
    const guildIDsWithEvents = new Set(events.map((event) => event.guildId));

    const fetchMessages = async (guildId: string, channelID: string | null, channelType: string) => {
      if (!channelID) {
        console.log(`Guilda ${guildId} não tem um canal de ${channelType} configurado.`);
        return;
      }

      const guild = client.guilds.cache.get(guildId) || (await client.guilds.fetch(guildId).catch(() => null));

      if (!guild) {
        console.log(`Guilda ${guildId} não encontrada no cache nem no fetch.`);
        return;
      }

      const channel = guild.channels.cache.get(channelID) || (await guild.channels.fetch(channelID).catch(() => null));

      if (!channel || !channel.isTextBased()) {
        console.log(`Canal ${channelID} (${channelType}) não encontrado ou não é baseado em texto.`);
        return;
      }

      // Buscar as últimas mensagens para garantir que o bot tenha o contexto correto
      await channel.messages.fetch({ limit: 100 });
    };

    // Iterar sobre todas as guildas e buscar canais de participação e financeiro
    for (const guildConfig of allGuildConfigs) {
      const { guildID, participationChannelID, financialChannelID } = guildConfig;

      // Buscar mensagens do canal de participação apenas se houver eventos na guilda
      if (guildIDsWithEvents.has(guildID)) {
        await fetchMessages(guildID, participationChannelID, "participação");
      }

      // Buscar mensagens do canal financeiro SEMPRE, independente de eventos
      await fetchMessages(guildID, financialChannelID, "financeiro");
    }
  } catch (error) {
    console.error("Erro ao buscar mensagens depois de reiniciar o bot", error);
  }
}
