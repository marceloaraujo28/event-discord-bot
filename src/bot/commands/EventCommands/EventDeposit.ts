import { EmbedBuilder } from "discord.js";
import { EventDepositType } from "../types";
import { useT } from "../../utils/useT";

export async function EventDeposit({ interaction, prisma, event, guildData }: EventDepositType) {
  await interaction.deferReply();

  const language = guildData.language;
  const t = useT(language);

  if (event.status !== "finished") {
    return await interaction.editReply(t("eventDeposit.noFininishedEvent"));
  }

  try {
    const message = await interaction.channel?.messages.fetch(event?.messageID ?? "");

    if (!message) {
      await interaction.editReply(t("eventDeposit.noMessage"));
      return;
    }

    const embed = message?.embeds[0];

    if (!embed) {
      return await interaction.editReply(t("eventDeposit.noEmbed"));
    }

    const guildData = await prisma.guilds.findUnique({
      where: {
        guildID: interaction.guild?.id,
      },
    });

    const financeChannelId = guildData?.financialChannelID;

    if (!financeChannelId) {
      return await interaction.editReply(t("eventDeposit.noFinancialChannel"));
    }

    const financeChannel = await interaction.guild?.channels.fetch(financeChannelId);

    if (!financeChannel || !financeChannel.isTextBased()) {
      return await interaction.editReply(t("eventDeposit.noFinancialChannel2"));
    }

    const depositValue = interaction.options.get("valor")?.value?.toString().trim();
    if (!depositValue) {
      return await interaction.editReply(t("eventDeposit.noValue"));
    }
    const regex = /^[0-9,\.]+$/;
    if (!regex.test(depositValue)) {
      return await interaction.editReply(t("eventDeposit.invalidValue"));
    }

    const taxaGuild = guildData.guildFee / 100;
    const taxaSeller = guildData.sellerFee / 100;

    // Remover pontos e vírgulas do valor que vem no comando
    const depositValueFormatted = Number(depositValue.replace(/[.,]/g, ""));

    const valueTaxaGuild = depositValueFormatted * taxaGuild;
    const valueTaxaVendedor = depositValueFormatted * taxaSeller;
    const valueDistribuido = depositValueFormatted - valueTaxaGuild - valueTaxaVendedor;

    const valueDistribuidoRounded = Math.round(valueDistribuido);

    // Enviar a mensagem de confirmação no canal financeiro
    const confirmationMessage = await financeChannel.send({
      embeds: [
        new EmbedBuilder()
          .setTitle(t("eventDeposit.embed.title"))
          .setDescription(
            t("eventDeposit.embed.description", {
              userId: interaction.user.id,
              depositValue: depositValueFormatted.toLocaleString("en-US"),
              eventName: event.eventName,
              valueDistribuido: valueDistribuidoRounded.toLocaleString("en-US"),
            })
          )
          .setColor("Gold")
          .setFooter({
            text: `ID:${event.eventName} v: ${depositValueFormatted.toLocaleString("en-US")}`,
          }),
      ],
    });

    await confirmationMessage.react("✅");

    // Armazena no banco o ID da mensagem de confirmação
    await prisma.event.update({
      where: { id: event.id },
      data: {
        confirmationMessageID: confirmationMessage.id,
        totalValue: valueDistribuidoRounded,
      },
    });

    return await interaction.editReply(t("eventDeposit.embed.successOrder", { financeChannelId }));
  } catch (error) {
    console.error("Error ao fazer pedido de depósito");
    return await interaction.editReply(t("eventDeposit.embed.catchError"));
  }
}
