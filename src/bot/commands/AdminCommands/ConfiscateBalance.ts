import { sendMessageChannel } from "../../utils/sendMessageChannel";
import { useT } from "../../utils/useT";
import { ConfiscateBalanceType } from "../types";

export async function ConfiscateBalance({ interaction, prisma, guildData }: ConfiscateBalanceType) {
  await interaction.deferReply();

  const language = guildData.language;
  const t = useT(language);

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
      return await interaction.editReply(t("confiscateBalance.userNotFound"));
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
      return await interaction.editReply(t("confiscateBalance.confiscateBalanceError"));
    }
    const guildData = await prisma.guilds.findUnique({
      where: {
        guildID: interaction.guildId ?? "",
      },
    });

    await sendMessageChannel({
      guild: interaction.guild,
      messageChannel: t("confiscateBalance.confiscateBalanceSuccess", {
        interactionUserId: interaction.user.id,
        userId: user?.id,
      }),
      channelID: guildData?.financialChannelID,
    });

    return await interaction.editReply(
      t("confiscateBalance.confiscateBalanceSuccessMessage", {
        userId: user?.id,
      })
    );
  } catch (error) {
    console.log("Erro ao confiscar saldo do usuário!", error);
    return await interaction.editReply(t("confiscateBalance.confiscateBalanceErrorMessage"));
  }
}
