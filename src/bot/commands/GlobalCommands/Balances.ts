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

    const mockUsers = [
      {
        userId: "123456789012345678",
        currentBalance: 1000.0,
      },
      {
        userId: "123456789012345678",
        currentBalance: 1000.0,
      },
      {
        userId: "123456789012345678",
        currentBalance: 1000.0,
      },
      {
        userId: "123456789012345678",
        currentBalance: 1000.0,
      },
      {
        userId: "123456789012345678",
        currentBalance: 1000.0,
      },
      {
        userId: "123456789012345678",
        currentBalance: 1000.0,
      },
      {
        userId: "123456789012345678",
        currentBalance: 1000.0,
      },
      {
        userId: "234567890123456789",
        currentBalance: 2000.0,
      },
      {
        userId: "345678901234567890",
        currentBalance: 3000.0,
      },
      {
        userId: "456789012345678901",
        currentBalance: 4000.0,
      },
      {
        userId: "567890123456789012",
        currentBalance: 5000.0,
      },
      {
        userId: "678901234567890123",
        currentBalance: 6000.0,
      },
      {
        userId: "789012345678901234",
        currentBalance: 7000.0,
      },
      {
        userId: "890123456789012345",
        currentBalance: 8000.0,
      },
      {
        userId: "890123456789012345",
        currentBalance: 8000.0,
      },
      {
        userId: "890123456789012345",
        currentBalance: 8000.0,
      },
      {
        userId: "890123456789012345",
        currentBalance: 8000.0,
      },
      {
        userId: "890123456789012345",
        currentBalance: 8000.0,
      },
      {
        userId: "890123456789012345",
        currentBalance: 8000.0,
      },
      {
        userId: "890123456789012345",
        currentBalance: 8000.0,
      },
      {
        userId: "890123456789012345",
        currentBalance: 8000.0,
      },
      {
        userId: "890123456789012345",
        currentBalance: 8000.0,
      },
      {
        userId: "890123456789012345",
        currentBalance: 8000.0,
      },
      {
        userId: "890123456789012345",
        currentBalance: 8000.0,
      },
      {
        userId: "890123456789012345",
        currentBalance: 8000.0,
      },
      {
        userId: "890123456789012345",
        currentBalance: 8000.0,
      },
      {
        userId: "890123456789012345",
        currentBalance: 8000.0,
      },
      {
        userId: "890123456789012345",
        currentBalance: 8000.0,
      },
      {
        userId: "890123456789012345",
        currentBalance: 8000.0,
      },
      {
        userId: "890123456789012345",
        currentBalance: 8000.0,
      },
      {
        userId: "890123456789012345",
        currentBalance: 8000.0,
      },
      {
        userId: "890123456789012345",
        currentBalance: 8000.0,
      },
      {
        userId: "890123456789012345",
        currentBalance: 8000.0,
      },
      {
        userId: "890123456789012345",
        currentBalance: 8000.0,
      },
      {
        userId: "890123456789012345",
        currentBalance: 8000.0,
      },
      {
        userId: "890123456789012345",
        currentBalance: 8000.0,
      },
      {
        userId: "890123456789012345",
        currentBalance: 8000.0,
      },
      {
        userId: "890123456789012345",
        currentBalance: 8000.0,
      },
      {
        userId: "890123456789012345",
        currentBalance: 8000.0,
      },
      {
        userId: "890123456789012345",
        currentBalance: 8000.0,
      },
      {
        userId: "890123456789012345",
        currentBalance: 8000.0,
      },
      {
        userId: "890123456789012345",
        currentBalance: 8000.0,
      },
      {
        userId: "890123456789012345",
        currentBalance: 8000.0,
      },
      {
        userId: "890123456789012345",
        currentBalance: 8000.0,
      },
      {
        userId: "890123456789012345",
        currentBalance: 8000.0,
      },
      {
        userId: "890123456789012345",
        currentBalance: 8000.0,
      },
      {
        userId: "890123456789012345",
        currentBalance: 55.0,
      },
    ];

    const names = mockUsers.map((user) => `<@${user.userId}>`);
    const balances = mockUsers.map((user) => `${Math.round(user.currentBalance).toLocaleString("en-US")}`);

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
