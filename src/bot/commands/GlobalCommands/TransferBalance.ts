import { TransferBalanceType } from "../types";

export async function TransferBalance({ interaction, prisma }: TransferBalanceType) {
  await interaction.deferReply();
  const user = interaction.options.get("membro")?.user;
  const value = interaction.options.get("valor")?.value?.toString().trim();
  const userId = user?.id || "";

  if (!value) {
    return await interaction.editReply("Campo em branco! Por favor digite um número");
  }
  const regex = /^[0-9,\.]+$/;
  if (!regex.test(value)) {
    return await interaction.editReply("Entrada inválida. Por favor, insira um número válido ex: 1,000,000");
  }

  // Remover pontos e vírgulas do valor que vem no comando
  const valueFormatted = Math.round(Number(value.replace(/[.,]/g, "")));

  //retirando saldo do remetendo e transferindo saldo para destinatário

  try {
    const interactionUser = await prisma.user.findUnique({
      where: {
        userId_guildID: {
          guildID: interaction.guildId ?? "",
          userId: interaction.user.id,
        },
      },
    });

    if (!interactionUser) {
      return interaction.editReply("Remetente não encontrado na base de dados!");
    }

    if (interactionUser.currentBalance < valueFormatted) {
      return await interaction.editReply(`Seu saldo é insuficiente para realizar a transferência!`);
    }

    const result = await prisma.$transaction([
      prisma.user.update({
        where: {
          userId_guildID: {
            guildID: interaction.guildId ?? "",
            userId: interaction.user.id,
          },
        },
        data: {
          currentBalance: {
            decrement: valueFormatted,
          },
        },
      }),
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
    ]);

    if (!result) {
      return await interaction.editReply(`Erro ao realizar a transferência!`);
    }

    return await interaction.editReply(
      `Transferência de \`${valueFormatted.toLocaleString(
        "en-US"
      )}\` para o jogador <@${userId}> realizada com sucesso!`
    );
  } catch (error) {
    console.error("Erro ao processar a transferência:", error);
    return await interaction.editReply("❌ Ocorreu um erro inesperado. Tente novamente mais tarde.");
  }
}
