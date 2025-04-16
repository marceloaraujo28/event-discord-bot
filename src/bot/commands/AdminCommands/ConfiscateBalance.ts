import { sendMessageChannel } from "../../utils/sendMessageChannel";
import { ConfiscateBalanceType } from "../types";

export async function ConfiscateBalance({ interaction, prisma }: ConfiscateBalanceType) {
  await interaction.deferReply();
  const user = interaction.options.get("membro")?.user;

  try {
    const findUser = await prisma.user.findUnique({
      where: {
        userId_guildID: {
          guildID: interaction.guildId ?? "",
          userId: user?.id ?? "",
        },
      },
    });

    if (!findUser) {
      return await interaction.editReply("Usuário não encontrado na base de dados!");
    }

    //retirar saldo do usuário e depositar na guild

    const result = await prisma.$transaction([
      prisma.guilds.update({
        where: {
          guildID: interaction.guildId ?? "",
        },
        data: {
          totalBalance: {
            increment: findUser.currentBalance,
          },
        },
      }),
      prisma.user.update({
        where: {
          userId_guildID: {
            guildID: interaction.guildId ?? "",
            userId: user?.id ?? "",
          },
        },
        data: {
          currentBalance: 0,
        },
      }),
    ]);

    if (!result) {
      return await interaction.editReply("Erro ao tentar confiscar saldo do usuário!");
    }
    const guildData = await prisma.guilds.findUnique({
      where: {
        guildID: interaction.guildId ?? "",
      },
    });

    await sendMessageChannel({
      guild: interaction.guild,
      messageChannel: `<@${interaction.user.id}> confiscou o saldo do jogador <@${user?.id}>`,
      channelID: guildData?.financialChannelID,
    });

    return await interaction.editReply(`Saldo do jogador <@${user?.id}> confiscado com sucesso!`);
  } catch (error) {
    console.log("Erro ao confiscar saldo do usuário!", error);
    return await interaction.editReply("Erro no banco ao tentar confiscar saldo do jogador!");
  }
}
