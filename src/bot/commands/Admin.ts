import { useT } from "../utils/useT";
import { ArchiveEvent } from "./AdminCommands/ArchiveEvent";
import { ConfiscateBalance } from "./AdminCommands/ConfiscateBalance";
import { DepositMember } from "./AdminCommands/DepositMember";
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
    const b = useT(interaction.locale);
    interaction.reply(b("admin.noGuild"));
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

  if (commandName === "remover-bot") {
    await RemoveBot({
      interaction,
      prisma,
      guildData,
    });
    return true;
  }

  if (commandName === "depositar-membro") {
    await DepositMember({
      interaction,
      prisma,
      guildData,
    });

    return true;
  }

  if (commandName === "arquivar-evento") {
    await ArchiveEvent({
      guildData,
      interaction,
      prisma,
    });

    return true;
  }
}
