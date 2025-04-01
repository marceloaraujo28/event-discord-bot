import { ConfiscateBalance } from "./AdminCommands/ConfiscateBalance";
import { GuildDeposit } from "./AdminCommands/GuildDeposit";
import { PayMember } from "./AdminCommands/PayMember";
import { RemoveBot } from "./AdminCommands/RemoveBot";
import { Setup } from "./AdminCommands/Setup";
import { UpdateGuildFee } from "./AdminCommands/UpdateGuildFee";
import { UpdateSellerFee } from "./AdminCommands/UpdateSellerFee";
import { WithdrawGuild } from "./AdminCommands/WithdrawGuild";
import { AdminType } from "./types";

export async function Admin({ commandName, interaction, prisma }: AdminType) {
  if (commandName === "setup") {
    await Setup({
      interaction,
      prisma,
    });

    return true;
  }

  if (commandName === "atualizar-taxa-guild") {
    await UpdateGuildFee({
      interaction,
      prisma,
    });

    return true;
  }

  if (commandName === "atualizar-taxa-vendedor") {
    await UpdateSellerFee({
      interaction,
      prisma,
    });
    return true;
  }

  if (commandName === "depositar-guild") {
    await GuildDeposit({
      interaction,
      prisma,
    });

    return true;
  }

  if (commandName === "sacar-guild") {
    await WithdrawGuild({
      interaction,
      prisma,
    });

    return true;
  }

  if (commandName === "pagar-membro") {
    await PayMember({
      interaction,
      prisma,
    });

    return true;
  }

  if (commandName === "confiscar-saldo") {
    await ConfiscateBalance({
      interaction,
      prisma,
    });

    return true;
  }

  if (commandName === "remove-bot") {
    await RemoveBot({
      interaction,
      prisma,
    });
    return true;
  }
}
