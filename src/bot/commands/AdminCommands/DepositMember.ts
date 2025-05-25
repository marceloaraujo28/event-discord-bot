import { sendMessageChannel } from "../../utils/sendMessageChannel";
import { useT } from "../../utils/useT";
import { DepositMemberType } from "../types";

export async function DepositMember({ interaction, prisma, guildData }: DepositMemberType) {
  await interaction.deferReply();

  const language = guildData.language;
  const t = useT(language);

  const user = interaction.options.get("membro")?.user;
  const value = interaction.options.get("valor")?.value?.toString().trim();

  if (!value) {
    return await interaction.editReply(t("depositMember.invalidValue"));
  }
  const regex = /^[0-9,\.]+$/;
  if (!regex.test(value)) {
    return await interaction.editReply(t("depositMember.invalidValue2"));
  }

  if (!user) {
    return await interaction.editReply(t("depositMember.userNotFound"));
  }

  const userId = user.id;

  // Remover pontos e vírgulas do valor que vem no comando
  const valueFormatted = Math.round(Number(value.replace(/[.,]/g, "")));

  try {
    const depositMember = await prisma.user.upsert({
      where: {
        userId_guildID: {
          guildID: interaction.guildId ?? "",
          userId,
        },
      },
      create: {
        userId,
        guildID: interaction.guildId ?? "",
        currentBalance: valueFormatted,
      },
      update: {
        currentBalance: {
          increment: valueFormatted,
        },
      },
    });

    if (!depositMember) {
      return await interaction.editReply(t("depositMember.depositMemberError"));
    }

    if (interaction.channelId !== guildData.financialChannelID) {
      await sendMessageChannel({
        channelID: guildData?.financialChannelID,
        messageChannel: t("depositMember.sendMessageChannel", {
          interactionUser: interaction.user.id,
          valueFormatted: valueFormatted.toLocaleString("en-US"),
          userId,
        }),
        guild: interaction.guild,
      });
    }

    return await interaction.editReply(
      t("depositMember.depositMemberSuccess", {
        valueFormatted: valueFormatted.toLocaleString("en-US"),
        userId,
      })
    );
  } catch (error) {
    console.log("Erro ao tentar fazer um depósito no saldo do membro", error);
    return await interaction.editReply(t("depositMember.catchError"));
  }
}
