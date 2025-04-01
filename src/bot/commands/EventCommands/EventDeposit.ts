import { EmbedBuilder } from "discord.js";
import { EventDepositType } from "../types";

export async function EventDeposit({ interaction, prisma, event }: EventDepositType) {
  await interaction.deferReply();

  if (event.status !== "finished") {
    return await interaction.editReply(`\n\`Esse comando só pode ser usado em um evento que foi finalizado!\``);
  }

  const message = await interaction.channel?.messages.fetch(event?.messageID ?? "");

  if (!message) {
    await interaction.editReply("Mensagens do canal do evento foram excluídas!");
    return;
  }

  const embed = message?.embeds[0];

  if (!embed) {
    return await interaction.editReply("Evento não encontrado na sala!");
  }

  const guildData = await prisma.guilds.findUnique({
    where: {
      guildID: interaction.guild?.id,
    },
  });

  const financeChannelId = guildData?.financialChannelID;

  if (!financeChannelId) {
    return await interaction.editReply(`\n\`Canal financeiro não configurado para esta guilda!\``);
  }

  const financeChannel = await interaction.guild?.channels.fetch(financeChannelId);

  if (!financeChannel || !financeChannel.isTextBased()) {
    return await interaction.editReply(`\n\`Canal financeiro não encontrado ou inválido!\``);
  }

  const depositValue = interaction.options.get("valor")?.value?.toString().trim();
  if (!depositValue) {
    return await interaction.editReply("Campo em branco! Por favor digite um número");
  }
  const regex = /^[0-9,\.]+$/;
  if (!regex.test(depositValue)) {
    return await interaction.editReply("Entrada inválida. Por favor, insira um número válido ex: 1,000,000");
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
        .setTitle("Confirmação de Depósito")
        .setDescription(
          `<@${interaction.user.id}> informou o valor total de \`${depositValueFormatted.toLocaleString(
            "en-US"
          )}\` arreacadado no **${
            event.eventName
          }**.\n\n  valor a ser distribuído entre os participantes **(com taxas)**: \` ${valueDistribuidoRounded.toLocaleString(
            "en-US"
          )} \`   \n\n
                            ✅ **Clique na reação abaixo para confirmar.**`
        )
        .setColor("Gold"),
    ],
  });

  await confirmationMessage.react("✅");

  // Armazena no banco o ID da mensagem de confirmação
  await prisma.event.update({
    where: { id: event.id },
    data: {
      confirmationMessageID: confirmationMessage.id,
    },
  });

  await interaction.editReply(`Pedido de depósito enviado para o canal <#${financeChannelId}>!`);
}
