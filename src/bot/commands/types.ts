import { ButtonInteraction, Client, CommandInteraction, GuildMember } from "discord.js";
import { Guilds, Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

type BaseType = {
  interaction: CommandInteraction;
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
};

export type OpenEventType = {
  interaction: CommandInteraction | ButtonInteraction;
  guildData: Guilds;
  prisma: PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>;
};

type EventType = Prisma.EventGetPayload<{}>;

export type AdminType = BaseType & { commandName: string };
export type GlobalType = BaseType & { commandName: string; member: GuildMember | undefined; guildData: Guilds };
export type SetupType = BaseType;
export type SellerType = BaseType & { event: EventType };
export type SimulateEventType = BaseType & { event: EventType; guildData: Guilds };
export type EventDepositType = BaseType & { event: EventType; guildData: Guilds };
export type EventCommandsType = BaseType & { event: EventType; commandName: string; guildData: Guilds };
export type UpdateGuildFeeType = BaseType & { guildData: Guilds };
export type UpdateSellerFeeType = BaseType & { guildData: Guilds };
export type UpdateParticipationType = BaseType & { event: EventType; guildData: Guilds };
export type GuildBalanceType = BaseType & { guildData: Guilds };
export type BalancesType = BaseType & { guildData: Guilds };
export type MemberBalanceType = BaseType & { guildData: Guilds };
export type MyBalanceType = BaseType & { member: GuildMember | undefined; guildData: Guilds };
export type GuildDepositType = BaseType & { guildData: Guilds };
export type WithdrawGuildType = BaseType & { guildData: Guilds };
export type PayMemberType = BaseType & { guildData: Guilds };
export type ConfiscateBalanceType = BaseType & { guildData: Guilds };
export type TransferBalanceType = BaseType & { guildData: Guilds };
export type RemoveBotType = BaseType & { guildData: Guilds };
export type PriceType = BaseType;
export type UpdateLanguageType = BaseType & { guildData: Guilds };
export type HelpType = { interaction: CommandInteraction };
