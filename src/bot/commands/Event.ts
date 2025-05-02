import { EventDeposit } from "./EventCommands/EventDeposit";
import { SimulateEvent } from "./EventCommands/SimulateEvent";
import { UpdateParticipation } from "./EventCommands/UpdateParticipation";
import { EventCommandsType } from "./types";

export async function Event({ commandName, event, interaction, prisma, guildData }: EventCommandsType) {
  if (commandName === "simular-evento") {
    await SimulateEvent({
      interaction,
      prisma,
      event,
      guildData,
    });
    return true;
  }

  if (commandName === "depositar-evento") {
    await EventDeposit({
      interaction,
      prisma,
      event,
      guildData,
    });

    return true;
  }

  if (commandName === "atualizar-participacao") {
    await UpdateParticipation({
      interaction,
      prisma,
      event,
      guildData,
    });
    return true;
  }
}
