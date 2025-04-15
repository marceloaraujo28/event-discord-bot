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
};

type EventType = Prisma.EventGetPayload<{}>;

export type AdminType = BaseType & { commandName: string };
export type GlobalType = BaseType & { commandName: string; member: GuildMember | undefined };
export type SetupType = BaseType;
export type SellerType = BaseType & { event: EventType };
export type SimulateEventType = BaseType & { event: EventType };
export type EventDepositType = BaseType & { event: EventType };
export type EventCommandsType = BaseType & { event: EventType; commandName: string };
export type UpdateGuildFeeType = BaseType;
export type UpdateSellerFeeType = BaseType;
export type UpdateParticipationType = BaseType & { event: EventType };
export type GuildBalanceType = BaseType;
export type BalancesType = BaseType;
export type MemberBalanceType = BaseType;
export type MyBalanceType = BaseType & { member: GuildMember | undefined };
export type GuildDepositType = BaseType;
export type WithdrawGuildType = BaseType;
export type PayMemberType = BaseType;
export type ConfiscateBalanceType = BaseType;
export type TransferBalanceType = BaseType;
export type RemoveBotType = BaseType;
export type PriceType = BaseType;
