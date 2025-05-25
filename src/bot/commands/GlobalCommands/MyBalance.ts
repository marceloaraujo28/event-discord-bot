import { useT } from "../../utils/useT";
import { MyBalanceType } from "../types";

export async function MyBalance({ interaction, prisma, member, guildData }: MyBalanceType) {
  await interaction.deferReply();

  const language = guildData.language;
  const t = useT(language);
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
      await interaction.editReply(t("myBalance.userNotFound", { userId: member?.id }));
      return;
    }

    const currentBalance = user.currentBalance;

    await interaction.editReply(
      t("myBalance.memberBalance", {
        userId: member?.id,
        currentBalance: currentBalance.toLocaleString("en-US"),
      })
    );
    return;
  } catch (error) {
    console.error("Erro ao tentar verificar saldo do próprio jogador", error);
    return await interaction.editReply(t("myBalance.catchError"));
  }
}
