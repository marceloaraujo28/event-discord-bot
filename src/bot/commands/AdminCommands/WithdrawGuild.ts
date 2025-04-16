import { sendMessageChannel } from "../../utils/sendMessageChannel";
import { WithdrawGuildType } from "../types";

export async function WithdrawGuild({ interaction, prisma }: WithdrawGuildType) {
  await interaction.deferReply();
  const withdrawValue = interaction.options.get("valor")?.value?.toString().trim();
  if (!withdrawValue) {
    return await interaction.editReply("Campo em branco! Por favor digite um número");
  }
  const regex = /^[0-9,\.]+$/;
  if (!regex.test(withdrawValue)) {
    return await interaction.editReply("Entrada inválida. Por favor, insira um número válido ex: 1,000,000");
  }

  // Remover pontos e vírgulas do valor que vem no comando
  const withdrawValueFormatted = Number(withdrawValue.replace(/[.,]/g, ""));

  const guildData = await prisma.guilds.findUnique({
    where: {
      guildID: interaction.guildId ?? "",
    },
  });

  const currentBalance = guildData?.totalBalance ?? 0;

  if (currentBalance < withdrawValueFormatted) {
    await sendMessageChannel({
      channelID: guildData?.financialChannelID,
      messageChannel: `<@${
        interaction.user.id
      }> tentou realizar um saque no valor de \`${withdrawValueFormatted.toLocaleString(
        "en-US"
      )}\` mas a guild não possui saldo suficiente!`,
      guild: interaction.guild,
    });

    return await interaction.editReply(`O saldo da guild é insuficiente para realizar o saque!`);
  }

  const withdraw = await prisma.guilds.update({
    where: {
      guildID: interaction?.guild?.id ?? "",
    },
    data: {
      totalBalance: {
        decrement: Math.round(withdrawValueFormatted),
      },
    },
  });

  if (!withdraw) {
    return await interaction.editReply("Erro ao realizar o saque!");
  }

  const currentValue = Math.round(withdraw.totalBalance);

  await sendMessageChannel({
    channelID: guildData?.financialChannelID,
    messageChannel: `<@${interaction.user.id}> sacou um valor de \`${withdrawValueFormatted.toLocaleString(
      "en-US"
    )}\`  do saldo da guild, saldo atual: \`${currentValue.toLocaleString("en-US")}\``,
    guild: interaction.guild,
  });

  return await interaction.editReply(
    `Saque efetuado com sucesso! o saldo agora é de: \`${currentValue.toLocaleString("en-US")}\``
  );
}
