import { MyBalanceType } from "../types";

export async function MyBalance({ interaction, prisma, member }: MyBalanceType) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        userId_guildID: {
          userId: member?.id ?? "",
          guildID: interaction.guildId ?? "",
        },
      },
    });

    if (!user) {
      await interaction.reply(`<@${member?.id}> nenhum dado seu foi encontrado na base de dados!`);
      return;
    }

    const currentBalance = user.currentBalance;

    await interaction.reply(`<@${member?.id}> seu saldo atual é de: \`${currentBalance.toLocaleString("en-US")}\``);
    return;
  } catch (error) {
    console.error("Erro ao tentar verificar saldo do próprio jogador", error);
    return await interaction.reply("Erro no banco ao tentar consultar seu saldo!");
  }
}
