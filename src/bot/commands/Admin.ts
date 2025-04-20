import { ConfiscateBalance } from "./AdminCommands/ConfiscateBalance";
import { GuildDeposit } from "./AdminCommands/GuildDeposit";
import { PayMember } from "./AdminCommands/PayMember";
import { RemoveBot } from "./AdminCommands/RemoveBot";
import { Setup } from "./AdminCommands/Setup";
import { UpdateGuildFee } from "./AdminCommands/UpdateGuildFee";
import { UpdateLanguage } from "./AdminCommands/UpdateLanguage";
import { UpdateSellerFee } from "./AdminCommands/UpdateSellerFee";
import { WithdrawGuild } from "./AdminCommands/WithdrawGuild";
import { AdminType } from "./types";

export async function Admin({ commandName, interaction, prisma }: AdminType) {
  if (!interaction.guildId) {
    interaction.reply("Erro ao executar o comando, guild id não existe!");
    return true;
  }

  if (commandName === "setup") {
    await Setup({
      interaction,
      prisma,
    });

    return true;
  }

  const guildData = await prisma.guilds.findUnique({
    where: {
      guildID: interaction.guildId,
    },
  });

  if (!guildData) {
    interaction.reply("Erro ao buscar dados da guild no banco");
    return true;
  }

  if (commandName === "atualizar-taxa-guild") {
    await UpdateGuildFee({
      interaction,
      prisma,
      guildData,
    });

    return true;
  }

  if (commandName === "atualizar-taxa-vendedor") {
    await UpdateSellerFee({
      interaction,
      prisma,
      guildData,
    });
    return true;
  }

  if (commandName === "depositar-guild") {
    await GuildDeposit({
      interaction,
      prisma,
      guildData,
    });

    return true;
  }

  if (commandName === "sacar-guild") {
    await WithdrawGuild({
      interaction,
      prisma,
      guildData,
    });

    return true;
  }

  if (commandName === "pagar-membro") {
    await PayMember({
      interaction,
      prisma,
      guildData,
    });

    return true;
  }

  if (commandName === "confiscar-saldo") {
    await ConfiscateBalance({
      interaction,
      prisma,
      guildData,
    });

    return true;
  }

  if (commandName === "lang") {
    await UpdateLanguage({
      interaction,
      prisma,
      guildData,
    });

    return true;
  }

  if (commandName === "remove-bot") {
    await RemoveBot({
      interaction,
      prisma,
      guildData,
    });
    return true;
  }
}
