import { EmbedBuilder } from "discord.js";
import { SimulateEventType } from "../types";
import { useT } from "../../utils/useT";

export async function SimulateEvent({ interaction, prisma, event, guildData }: SimulateEventType) {
  await interaction.deferReply();

  const language = guildData.language;
  const t = useT(language);

  try {
    const message = await interaction.channel?.messages.fetch(event?.messageID ?? "");

    if (!message) {
      await interaction.editReply(t("simulateEvent.noMessage"));
      return;
    }

    const embed = message?.embeds[0];

    if (!embed) {
      return await interaction.editReply("simulateEvent.noEmbed");
    }

    if (!interaction.guildId) {
      return await interaction.editReply(t("simulateEvent.noGuildId"));
    }

    const guild = await prisma.guilds.findUnique({
      where: {
        guildID: interaction.guildId,
      },
    });

    if (!guild) {
      return await interaction.editReply(t("simulateEvent.noGuild"));
    }

    //field participantes
    const participantsMentions = embed.fields[3].value;

    const participantIds = participantsMentions.match(/<@(\d+)>/g)?.map((mention) => mention.replace(/[<@>]/g, ""));

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
      return await interaction.editReply(t("simulateEvent.emptyValue"));
    }
    // Verificar se é um número válido com vírgulas e pontos
    const regex = /^[0-9,\.]+$/;
    if (!regex.test(totalValue)) {
      return await interaction.editReply(t("simulateEvent.invalidValue"));
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
      return await interaction.editReply(t("simulateEvent.errorUpdateEvent", { eventName: event?.eventName }));
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

    const newEmbed = new EmbedBuilder()
      .setTitle(t("simulateEvent.embed.title", { eventName: event?.eventName.toUpperCase() }))
      .addFields(
        {
          name: t("simulateEvent.embed.seller"),
          value: `<@${event?.seller}>`,
          inline: true,
        },
        {
          name: t("simulateEvent.embed.valueTotal"),
          value: `${totalValueFormatted.toLocaleString("en-US")}`,
          inline: true,
        },
        {
          name: t("simulateEvent.embed.guildFee"),
          value: `${taxaGuild}% (${valueTaxaGuildRounded.toLocaleString("en-US")})`,
          inline: true,
        },
        {
          name: t("simulateEvent.embed.sellerFee"),
          value: `${taxaSeller}% (${valueTaxaSellerRounded.toLocaleString("en-US")})`,
        },
        {
          name: t("simulateEvent.embed.participants"),
          value: distributionList,
        },
        {
          name: t("simulateEvent.embed.distribuitedTotal"),
          value: `**${totalValueWithFees.toLocaleString("en-US")}**`,
        },
        {
          name: t("simulateEvent.embed.nextSteps"),
          value: t("simulateEvent.embed.nextStepsValue", {
            eventValue: totalValueFormatted.toLocaleString("en-US"),
          }),
        }
      );

    await interaction.editReply({ embeds: [newEmbed] });
  } catch (error) {
    console.error("Error ao simular o evento", error);
    return await interaction.editReply(t("simulateEvent.catchError"));
  }
}
