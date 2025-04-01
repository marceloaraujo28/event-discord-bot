import { EmbedBuilder } from "discord.js";
import { BalancesType } from "../types";

export async function Balances({ interaction, prisma }: BalancesType) {
  try {
    const users = await prisma.user.findMany({
      where: {
        guildID: interaction.guildId ?? "",
      },
    });

    if (!users.length) {
      await interaction.reply("Sem dados registrados no banco para exibir os saldos!");
      return;
    }

    const names = users.map((user) => `<@${user.userId}>`).join("\n");

    const balances = users.map((user) => `${Math.round(user.currentBalance).toLocaleString("en-US")}`).join("\n");
    const newEmbed = new EmbedBuilder()
      .setTitle(`SALDO ATUAL DOS JOGADORES`)
      .addFields(
        {
          name: "Nome",
          value: names,
          inline: true,
        },
        {
          name: "Saldo",
          value: balances,
          inline: true,
        }
      )
      .setColor("Green");

    return await interaction.reply({ embeds: [newEmbed] });
  } catch (error) {
    console.error("Erro ao verificar saldo de todos os jogadores!", error);
    return await interaction.reply("Erro no banco ao verificar saldo dos jogadores!");
  }
}
