import { MyBalanceType } from "../types";

export async function MyBalance({ interaction, prisma, member }: MyBalanceType) {
  await interaction.deferReply();
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
      await interaction.editReply(`<@${member?.id}> nenhum dado seu foi encontrado na base de dados!`);
      return;
    }

    const currentBalance = user.currentBalance;

    await interaction.editReply(`<@${member?.id}> seu saldo atual é de: \`${currentBalance.toLocaleString("en-US")}\``);
    return;
  } catch (error) {
    console.error("Erro ao tentar verificar saldo do próprio jogador", error);
    return await interaction.editReply("Erro no banco ao tentar consultar seu saldo!");
  }
}
