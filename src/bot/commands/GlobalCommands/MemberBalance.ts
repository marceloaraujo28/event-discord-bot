import { useT } from "../../utils/useT";
import { MemberBalanceType } from "../types";

export async function MemberBalance({ interaction, prisma, guildData }: MemberBalanceType) {
  await interaction.deferReply();

  const language = guildData.language;
  const t = useT(language);

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
      return await interaction.editReply(t("memberBalance.userNotFound"));
    }

    const currentBalance = Math.round(Number(findUser?.currentBalance));

    return interaction.editReply(
      t("memberBalance.balance", {
        userId,
        currentBalance: currentBalance.toLocaleString("en-US"),
      })
    );
  } catch (error) {
    console.error("Erro ao tentar verificar o saldo do membro", error);
    return await interaction.editReply(t("memberBalance.catchError"));
  }
}
