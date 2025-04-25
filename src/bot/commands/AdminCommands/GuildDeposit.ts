import { sendMessageChannel } from "../../utils/sendMessageChannel";
import { useT } from "../../utils/useT";
import { GuildDepositType } from "../types";

export async function GuildDeposit({ interaction, prisma, guildData }: GuildDepositType) {
  await interaction.deferReply();

  const language = guildData.language;

  const t = useT(language);

  const depositValue = interaction.options.get("valor")?.value?.toString().trim();
  if (!depositValue) {
    return await interaction.editReply(t("guildDeposit.invalidValue"));
  }
  const regex = /^[0-9,\.]+$/;
  if (!regex.test(depositValue)) {
    return await interaction.editReply(t("guildDeposit.invalidValue2"));
  }

  // Remover pontos e vírgulas do valor que vem no comando
  const depositValueFormatted = Number(depositValue.replace(/[.,]/g, ""));

  try {
    const depositTable = await prisma.guilds.update({
      where: {
        guildID: interaction.guildId ?? "",
      },
      data: {
        totalBalance: {
          increment: Math.round(depositValueFormatted),
        },
      },
    });

    if (!depositTable) {
      return await interaction.editReply(t("guildDeposit.updateDepositError"));
    }
    const guildData = await prisma.guilds.findUnique({
      where: {
        guildID: interaction.guildId ?? "",
      },
    });

    const currentValue = Math.round(depositTable.totalBalance);

    await sendMessageChannel({
      channelID: guildData?.financialChannelID,
      messageChannel: t("guildDeposit.updateDepositSuccess", {
        userId: interaction.user.id,
        depositValue: depositValueFormatted.toLocaleString("en-US"),
        currentValue: currentValue.toLocaleString("en-US"),
      }),
      guild: interaction.guild,
    });

    return await interaction.editReply(
      t("guildDeposit.successDeposit", {
        currentValue: currentValue.toLocaleString("en-US"),
      })
    );
  } catch (error) {
    console.error("Error ao fazer depósito no banco de dados:", error);
    return await interaction.editReply(t("guildDeposit.catchError"));
  }
}
