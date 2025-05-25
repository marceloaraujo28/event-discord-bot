import { Balances } from "./GlobalCommands/Balances";
import { MemberBalance } from "./GlobalCommands/MemberBalance";
import { MyBalance } from "./GlobalCommands/MyBalance";
import { TransferBalance } from "./GlobalCommands/TransferBalance";
import { GlobalType } from "./types";
import { GuildBalance } from "./GlobalCommands/GuildBalance";

export async function Global({ commandName, interaction, prisma, member, guildData }: GlobalType) {
  if (commandName === "saldos") {
    await Balances({
      interaction,
      prisma,
      guildData,
    });

    return true;
  }

  if (commandName === "saldo-guild") {
    await GuildBalance({
      interaction,
      prisma,
      guildData,
    });
    return true;
  }

  if (commandName === "meu-saldo") {
    await MyBalance({
      member,
      interaction,
      prisma,
      guildData,
    });
    return true;
  }

  if (commandName === "transferir-saldo") {
    await TransferBalance({
      interaction,
      prisma,
      guildData,
    });

    return true;
  }

  if (commandName === "saldo-membro") {
    await MemberBalance({
      interaction,
      prisma,
      guildData,
    });
    return true;
  }

  return false;
}
