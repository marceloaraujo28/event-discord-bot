import { EmbedBuilder } from "discord.js";
import { BalancesType } from "../types";

export async function Balances({ interaction, prisma }: BalancesType) {
  await interaction.deferReply();
  try {
    const users = await prisma.user.findMany({
      where: {
        guildID: interaction.guildId ?? "",
      },
    });

    if (!users.length) {
      await interaction.editReply("Sem dados registrados no banco para exibir os saldos!");
      return;
    }

    const names = users.map((user) => `<@${user.userId}>`);
    const balances = users.map((user) => `${Math.round(user.currentBalance).toLocaleString("en-US")}`);

    const embeds = [];
    const chunkSize = 40;

    for (let i = 0; i < names.length; i += chunkSize) {
      const chunkNames = names.slice(i, i + chunkSize).join("\n");
      const chunkBalances = balances.slice(i, i + chunkSize).join("\n");

      const embed = new EmbedBuilder()
        .setTitle(`SALDO ATUAL DOS JOGADORES`)
        .addFields(
          { name: "Nome", value: chunkNames, inline: true },
          { name: "Saldo", value: chunkBalances, inline: true }
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
    return await interaction.editReply("Erro no banco ao verificar saldo dos jogadores!");
  }
}
