import { sendMessageChannel } from "../../utils/sendMessageChannel";
import { PayMemberType } from "../types";

export async function PayMember({ interaction, prisma }: PayMemberType) {
  const user = interaction.options.get("membro")?.user;
  const value = interaction.options.get("valor")?.value?.toString().trim();
  const userId = user?.id || "";

  if (!value) {
    return await interaction.reply("Campo em branco! Por favor digite um número");
  }
  const regex = /^[0-9,\.]+$/;
  if (!regex.test(value)) {
    return await interaction.reply("Entrada inválida. Por favor, insira um número válido ex: 1,000,000");
  }

  // Remover pontos e vírgulas do valor que vem no comando
  const valueFormatted = Math.round(Number(value.replace(/[.,]/g, "")));

  const guildData = await prisma.guilds.findUnique({
    where: {
      guildID: interaction.guildId ?? "",
    },
  });

  const currentBalance = guildData?.totalBalance ?? 0;

  if (currentBalance < valueFormatted) {
    await sendMessageChannel({
      channelID: guildData?.financialChannelID,
      messageChannel: `<@${interaction.user.id}> tentou realizar um pagamento de \`${valueFormatted.toLocaleString(
        "en-US"
      )}\` para o jogador <@${userId}>, mas a guild não possui saldo suficiente!`,
      guild: interaction.guild,
    });

    return await interaction.reply(`O saldo da guild é insuficiente para realizar o pagamento!`);
  }

  const result = await prisma.$transaction([
    prisma.user.upsert({
      where: {
        userId_guildID: {
          guildID: interaction.guildId ?? "",
          userId,
        },
      },
      create: {
        userId,
        currentBalance: valueFormatted,
        guildID: interaction.guildId ?? "",
      },
      update: {
        currentBalance: {
          increment: valueFormatted,
        },
      },
    }),
    prisma.guilds.update({
      where: {
        guildID: interaction.guildId ?? "",
      },
      data: {
        totalBalance: {
          decrement: valueFormatted,
        },
      },
    }),
  ]);

  if (!result) {
    return await interaction.reply("Erro ao tentar realizar pagamento para o jogador!");
  }

  await sendMessageChannel({
    channelID: guildData?.financialChannelID,
    messageChannel: `<@${interaction.user.id}> realizou um pagamento de \`${valueFormatted.toLocaleString(
      "en-US"
    )}\` para o jogador <@${userId}>`,
    guild: interaction.guild,
  });

  return await interaction.reply(
    `Pagamento para <@${userId}> no valor de \`${valueFormatted.toLocaleString("en-US")}\` realizado com sucesso!`
  );
}
