import { GuildBalanceType } from "../types";

export async function GuildBalance({ interaction, prisma }: GuildBalanceType) {
  await interaction.deferReply();
  try {
    const guild = await prisma.guilds.findUnique({
      where: {
        guildID: interaction.guildId ?? "",
      },
    });

    if (!guild) {
      await interaction.editReply(`Guild não cadastrada no banco!`);
      return;
    }

    const currentBalance = Math.round(guild.totalBalance);

    await interaction.editReply(`O saldo da guild é de: \`${currentBalance.toLocaleString("en-US")}\``);
    return;
  } catch (error) {
    console.log("Erro ao buscar o saldo da guild!", error);
    return await interaction.editReply("Erro ao buscar saldo da guild na base de dados!");
  }
}
