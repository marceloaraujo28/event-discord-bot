import { CommandInteraction } from "discord.js";
import { ParticipantTimesType } from "../types";

export type OpenEventType = {
  eventCounter: number;
  interaction: CommandInteraction;
  eventStore: Record<string, Record<string, ParticipantTimesType>>;
};
