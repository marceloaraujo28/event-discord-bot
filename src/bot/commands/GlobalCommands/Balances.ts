import { EmbedBuilder } from "discord.js";
import { BalancesType } from "../types";
import { useT } from "../../utils/useT";

export async function Balances({ interaction, prisma, guildData }: BalancesType) {
  await interaction.deferReply();

  const language = guildData.language;
  const t = useT(language);

  try {
    const users = await prisma.user.findMany({
      where: {
        guildID: interaction.guildId ?? "",
      },
      orderBy: {
        currentBalance: "desc",
      },
    });

    if (!users.length) {
      await interaction.editReply(t("balances.userNotFound"));
      return;
    }

    const filteredUsers = users.filter((users) => users.currentBalance > 0);

    if (!filteredUsers.length) {
      return await interaction.editReply(t("balances.noBalances"));
    }

    const names = filteredUsers.map((user) => `<@${user.userId}>`);
    const balances = filteredUsers.map((user) => {
      return `${Math.round(user.currentBalance).toLocaleString("en-US")}`;
    });

    const embeds = [];
    const chunkSize = 40;

    for (let i = 0; i < names.length; i += chunkSize) {
      const chunkNames = names.slice(i, i + chunkSize).join("\n");
      const chunkBalances = balances.slice(i, i + chunkSize).join("\n");

      const embed = new EmbedBuilder()
        .setTitle(t("balances.embed.title"))
        .addFields(
          { name: t("balances.embed.fieldName"), value: chunkNames, inline: true },
          { name: t("balances.embed.fieldBalance"), value: chunkBalances, inline: true }
        )
        .setColor("Green");

      embeds.push(embed);
    }

    // Envia todos os embeds
    for (const embed of embeds) {
      await interaction.followUp({ embeds: [embed] });
    }
  } catch (error) {
    console.error("Erro ao verificar saldo de todos os jogadores!", error);
    return await interaction.editReply(t("balances.catchError"));
  }
}
