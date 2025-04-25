import { sendMessageChannel } from "../../utils/sendMessageChannel";
import { useT } from "../../utils/useT";
import { PayMemberType } from "../types";

export async function PayMember({ interaction, prisma, guildData }: PayMemberType) {
  await interaction.deferReply();

  const language = guildData.language;

  const t = useT(language);

  const user = interaction.options.get("membro")?.user;
  const value = interaction.options.get("valor")?.value?.toString().trim();
  const userId = user?.id || "";

  if (!value) {
    return await interaction.editReply(t("payMember.invalidValue"));
  }
  const regex = /^[0-9,\.]+$/;
  if (!regex.test(value)) {
    return await interaction.editReply(t("payMember.invalidValue2"));
  }

  // Remover pontos e vírgulas do valor que vem no comando
  const valueFormatted = Math.round(Number(value.replace(/[.,]/g, "")));

  const currentBalance = guildData?.totalBalance ?? 0;

  if (currentBalance < valueFormatted) {
    await sendMessageChannel({
      channelID: guildData?.financialChannelID,
      messageChannel: t("payMember.insufficientGuildBalance", {
        interactionUserId: interaction.user.id,
        userId,
        withdrawValue: valueFormatted.toLocaleString("en-US"),
      }),
      guild: interaction.guild,
    });

    return await interaction.editReply(t("payMember.insufficientGuildBalanceMessage"));
  }

  try {
    const searchBalance = await prisma.user.findUnique({
      where: {
        userId_guildID: {
          guildID: interaction.guildId ?? "",
          userId,
        },
      },
    });

    const currentBalanceUser = searchBalance?.currentBalance ?? 0;

    if (valueFormatted > currentBalanceUser) {
      return await interaction.editReply(t("payMember.insufficientUserBalance"));
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
            decrement: valueFormatted,
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
      return await interaction.editReply(t("payMember.erroPayMember"));
    }

    await sendMessageChannel({
      channelID: guildData?.financialChannelID,
      messageChannel: t("payMember.successPayMember", {
        interactionUserId: interaction.user.id,
        userId,
        withdrawValue: valueFormatted.toLocaleString("en-US"),
      }),
      guild: interaction.guild,
    });

    return await interaction.editReply(
      t("payMember.successPayMemberMessage", {
        userId: userId,
        withdrawValue: valueFormatted.toLocaleString("en-US"),
      })
    );
  } catch (error) {
    console.error("Error ao pagar membro", error);
    return await interaction.editReply(t("payMember.catchError"));
  }
}
