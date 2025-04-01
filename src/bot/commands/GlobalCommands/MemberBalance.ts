import { MemberBalanceType } from "../types";

export async function MemberBalance({ interaction, prisma }: MemberBalanceType) {
  const user = interaction.options.get("membro")?.user;
  const userId = user?.id || "";
  try {
    const findUser = await prisma.user.findUnique({
      where: {
        userId_guildID: {
          guildID: interaction.guildId ?? "",
          userId,
        },
      },
    });

    if (!findUser) {
      await interaction.reply("Usuário não encontrado na base de dados!");
    }

    const currentBalance = Math.round(Number(findUser?.currentBalance));

    return interaction.reply(`O saldo de <@${userId}> é: \`${currentBalance.toLocaleString("en-US")}\``);
  } catch (error) {
    console.error("Erro ao tentar verificar o saldo do membro", error);
    return await interaction.reply("Erro no banco ao tentar consultar saldo do membro!");
  }
}
