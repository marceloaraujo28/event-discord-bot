import { sendMessageChannel } from "../../utils/sendMessageChannel";
import { GuildDepositType } from "../types";

export async function GuildDeposit({ interaction, prisma }: GuildDepositType) {
  await interaction.deferReply();
  const depositValue = interaction.options.get("valor")?.value?.toString().trim();
  if (!depositValue) {
    return await interaction.editReply("Campo em branco! Por favor digite um número");
  }
  const regex = /^[0-9,\.]+$/;
  if (!regex.test(depositValue)) {
    return await interaction.editReply("Entrada inválida. Por favor, insira um número válido ex: 1,000,000");
  }

  // Remover pontos e vírgulas do valor que vem no comando
  const depositValueFormatted = Number(depositValue.replace(/[.,]/g, ""));

  const depositTable = await prisma.guilds.update({
    where: {
      guildID: interaction.guildId ?? "",
    },
    data: {
      totalBalance: {
        increment: Math.round(depositValueFormatted),
      },
    },
  });

  if (!depositTable) {
    return await interaction.editReply("Erro ao realizar o depósito!");
  }
  const guildData = await prisma.guilds.findUnique({
    where: {
      guildID: interaction.guildId ?? "",
    },
  });

  const currentValue = Math.round(depositTable.totalBalance);

  await sendMessageChannel({
    channelID: guildData?.financialChannelID,
    messageChannel: `<@${interaction.user.id}> fez um depósito no valor de \`${depositValueFormatted.toLocaleString(
      "en-US"
    )}\` na guild, saldo atual: \`${currentValue.toLocaleString("en-US")}\``,
    guild: interaction.guild,
  });

  return await interaction.editReply(
    `Depósito efetuado com sucesso! o saldo agora é de: \`${currentValue.toLocaleString("en-US")}\``
  );
}
