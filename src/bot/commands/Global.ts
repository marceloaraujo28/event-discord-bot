import { Embed } from "discord.js";
import { Balances } from "./GlobalCommands/Balances";
import { Help } from "./GlobalCommands/Help";
import { MemberBalance } from "./GlobalCommands/MemberBalance";
import { MyBalance } from "./GlobalCommands/MyBalance";
import { TransferBalance } from "./GlobalCommands/TransferBalance";
import { GlobalType } from "./types";
import { GuildBalance } from "./GlobalCommands/GuildBalance";

export async function Global({ commandName, interaction, prisma, member }: GlobalType) {
  if (commandName === "saldos") {
    await Balances({
      interaction,
      prisma,
    });

    return true;
  }

  if (commandName === "saldo-guild") {
    await GuildBalance({
      interaction,
      prisma,
    });
    return true;
  }

  if (commandName === "meu-saldo") {
    await MyBalance({
      member,
      interaction,
      prisma,
    });
    return true;
  }

  if (commandName === "transferir-saldo") {
    await TransferBalance({
      interaction,
      prisma,
    });

    return true;
  }

  if (commandName === "saldo-membro") {
    await MemberBalance({
      interaction,
      prisma,
    });
    return true;
  }

  if (commandName === "help") {
    const embed = Help();
    await interaction.reply({ embeds: [embed] });
    return true;
  }

  return false;
}
