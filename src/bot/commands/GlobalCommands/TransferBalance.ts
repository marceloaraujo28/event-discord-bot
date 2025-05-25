import { useT } from "../../utils/useT";
import { TransferBalanceType } from "../types";

export async function TransferBalance({ interaction, prisma, guildData }: TransferBalanceType) {
  await interaction.deferReply();
  const user = interaction.options.get("membro")?.user;
  const value = interaction.options.get("valor")?.value?.toString().trim();
  const userId = user?.id || "";

  const language = guildData.language;
  const t = useT(language);

  if (!value) {
    return await interaction.editReply(t("transferBalance.invalidValue"));
  }
  const regex = /^[0-9,\.]+$/;
  if (!regex.test(value)) {
    return await interaction.editReply(t("transferBalance.invalidValue2"));
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
      return interaction.editReply(t("transferBalance.senderNotFound"));
    }

    if (interactionUser.currentBalance < valueFormatted) {
      return await interaction.editReply(t("transferBalance.insufficientBalance"));
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
      return await interaction.editReply(t("transferBalance.transferError"));
    }

    return await interaction.editReply(
      t("transferBalance.transferSuccess", {
        value: valueFormatted.toLocaleString("en-US"),
        userId,
      })
    );
  } catch (error) {
    console.error("Erro ao processar a transferência:", error);
    return await interaction.editReply(t("transferBalance.catchError"));
  }
}
