import { EmbedBuilder } from "discord.js";
import { SimulateEventType } from "../types";

export async function SimulateEvent({ interaction, prisma, event }: SimulateEventType) {
  await interaction.deferReply();
  try {
    const message = await interaction.channel?.messages.fetch(event?.messageID ?? "");

    if (!message) {
      await interaction.editReply("Mensagens do canal do evento foram excluídas!");
      return;
    }

    const embed = message?.embeds[0];

    if (!embed) {
      return await interaction.editReply("Evento não encontrado na sala!");
    }

    if (!interaction.guildId) {
      return await interaction.editReply("Não foi possível buscar o id da guild!");
    }

    const guild = await prisma.guilds.findUnique({
      where: {
        guildID: interaction.guildId,
      },
    });

    if (!guild) {
      return await interaction.editReply("Guild não encontrada no banco de dados!");
    }

    const participantMentions = embed.fields.find((field) => field.name === "Participantes")?.value || "";
    const participantIds = participantMentions.match(/<@(\d+)>/g)?.map((mention) => mention.replace(/[<@>]/g, ""));

    const participantsData = await prisma.participant.findMany({
      where: {
        userId: {
          in: participantIds,
        },
        eventId: event?.id,
      },
      select: {
        userId: true,
        percentage: true,
      },
    });

    const totalValue = interaction.options.get("valor")?.value?.toString().trim();
    if (!totalValue) {
      return await interaction.editReply("Campo em branco! Por favor digite um número");
    }
    // Verificar se é um número válido com vírgulas e pontos
    const regex = /^[0-9,\.]+$/;
    if (!regex.test(totalValue)) {
      return await interaction.editReply("Entrada inválida. Por favor, insira um número válido ex: 1,000,000");
    }

    const taxaGuild = guild.guildFee;
    const taxaSeller = guild.sellerFee;

    // Remover pontos e vírgulas do valor que vem no comando
    const totalValueFormatted = Number(totalValue.replace(/[.,]/g, ""));

    // fazendo contas para verificar valores das taxas
    const valueTaxaGuild = (totalValueFormatted * taxaGuild) / 100;
    const valueTaxaSeller = (totalValueFormatted * taxaSeller) / 100;

    const valueTaxaGuildRounded = Math.ceil(valueTaxaGuild);
    const valueTaxaSellerRounded = Math.ceil(valueTaxaSeller);

    const valueFees = valueTaxaGuildRounded + valueTaxaSellerRounded;
    const totalValueWithFees = totalValueFormatted - valueFees;

    //salvando no banco o valor total do evento tirando os descontos das taxas
    const updateValueEvent = await prisma.event.update({
      where: {
        id: event?.id,
      },
      data: {
        totalValue: totalValueWithFees,
      },
    });

    if (!updateValueEvent) {
      console.log("Erro ao atualizar o valor do evento", event?.eventName);
      return;
    }

    // Somar todas as porcentagens dos participantes
    const totalPercentage = participantsData.reduce((sum, p) => sum + p.percentage, 0);

    // Distribuir valores proporcionalmente
    let participantValues = participantsData.map((participant) => ({
      userId: participant.userId,
      percentage: participant.percentage,
      rawValue: (totalValueWithFees * participant.percentage) / totalPercentage,
      roundedValue: Math.floor((totalValueWithFees * participant.percentage) / totalPercentage), // Arredondar para baixo inicialmente
    }));

    // Ajustar a soma para garantir que o total seja exato
    const distributedTotal = participantValues.reduce((sum, p) => sum + p.roundedValue, 0);
    const diff = totalValueWithFees - distributedTotal;

    // Distribuir a diferença ajustando o valor de alguns participantes
    for (let i = 0; i < diff; i++) {
      participantValues[i % participantValues.length].roundedValue += 1;
    }

    const distributionList = participantValues
      .map((p) => `<@${p.userId}>: ${p.roundedValue.toLocaleString("en-US")}`)
      .join("\n");

    const newEmbed = new EmbedBuilder().setTitle(`SIMULAÇÃO DE VENDA DO ${event?.eventName.toUpperCase()}`).addFields(
      {
        name: "Seller",
        value: `<@${event?.seller}>`,
        inline: true,
      },
      {
        name: "Valor total",
        value: `${totalValueFormatted.toLocaleString("en-US")}`,
        inline: true,
      },
      {
        name: "Taxa guilda",
        value: `${taxaGuild}% (${valueTaxaGuildRounded.toLocaleString("en-US")})`,
        inline: true,
      },
      {
        name: "Taxa vendedor",
        value: `${taxaSeller}% (${valueTaxaSellerRounded.toLocaleString("en-US")})`,
      },
      {
        name: "Participantes",
        value: distributionList,
      },
      {
        name: "Total a ser distrubuído entre os participantes com taxas aplicadas",
        value: `${totalValueWithFees.toLocaleString("en-US")}`,
      },
      {
        name: "Próximo passo",
        value: `Utilize o comando abaixo para depositar o valor do evento na guilda:\n\`\`\`\n/depositar-evento ${totalValueFormatted.toLocaleString(
          "en-US"
        )}\n\`\`\``,
      }
    );

    await interaction.editReply({ embeds: [newEmbed] });
  } catch (error) {
    console.error("Error ao simular o evento", error);
    return await interaction.editReply("Erro ao simular o evento");
  }
}
