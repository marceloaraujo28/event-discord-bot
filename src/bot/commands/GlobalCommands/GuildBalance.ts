import { useT } from "../../utils/useT";
import { GuildBalanceType } from "../types";

export async function GuildBalance({ interaction, prisma, guildData }: GuildBalanceType) {
  await interaction.deferReply();
  const language = guildData.language;
  const t = useT(language);

  try {
    const guild = await prisma.guilds.findUnique({
      where: {
        guildID: interaction.guildId ?? "",
      },
    });

    if (!guild) {
      await interaction.editReply(t("guildBalance.guildNotFound"));
      return;
    }

    const currentBalance = Math.round(guild.totalBalance);

    await interaction.editReply(
      t("guildBalance.guildBalance", { currentBalance: currentBalance.toLocaleString("en-US") })
    );
    return;
  } catch (error) {
    console.log("Erro ao buscar o saldo da guild!", error);
    return await interaction.editReply(t("guildBalance.catchError"));
  }
}
