import { sendMessageChannel } from "../../utils/sendMessageChannel";
import { useT } from "../../utils/useT";
import { WithdrawGuildType } from "../types";

export async function WithdrawGuild({ interaction, prisma, guildData }: WithdrawGuildType) {
  await interaction.deferReply();

  const language = guildData.language;

  const t = useT(language);

  const withdrawValue = interaction.options.get("valor")?.value?.toString().trim();
  if (!withdrawValue) {
    return await interaction.editReply(t("withdrawGuild.invalidValue"));
  }
  const regex = /^[0-9,\.]+$/;
  if (!regex.test(withdrawValue)) {
    return await interaction.editReply(t("withdrawGuild.invalidValue2"));
  }

  // Remover pontos e vírgulas do valor que vem no comando
  const withdrawValueFormatted = Number(withdrawValue.replace(/[.,]/g, ""));

  const currentBalance = guildData?.totalBalance ?? 0;

  if (currentBalance < withdrawValueFormatted) {
    await sendMessageChannel({
      channelID: guildData?.financialChannelID,
      messageChannel: t("withdrawGuild.withdrawInsuficient", {
        userId: interaction.user.id,
        withdrawValue: withdrawValueFormatted.toLocaleString("en-US"),
      }),
      guild: interaction.guild,
    });

    return await interaction.editReply(t("withdrawGuild.withdrawInsuficientMessage"));
  }

  try {
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
      return await interaction.editReply(t("withdrawGuild.withdrawError"));
    }

    const currentValue = Math.round(withdraw.totalBalance);

    await sendMessageChannel({
      channelID: guildData?.financialChannelID,
      messageChannel: t("withdrawGuild.withdrawSuccess", {
        userId: interaction.user.id,
        withdrawValue: withdrawValueFormatted.toLocaleString("en-US"),
        currentValue: currentValue.toLocaleString("en-US"),
      }),
      guild: interaction.guild,
    });

    return await interaction.editReply(
      t("withdrawGuild.withdrawSuccessMessage", {
        currentValue: currentValue.toLocaleString("en-US"),
      })
    );
  } catch (error) {
    console.error("Erro no banco ao realizar o saque:", error);
    return await interaction.editReply(t("withdrawGuild.catchError"));
  }
}
