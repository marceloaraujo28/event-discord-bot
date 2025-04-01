import { EmbedBuilder } from "discord.js";
import { StartEventType } from "./types";

export async function StartEvent({
  user,
  reaction,
  creatorName,
  message,
  embed,
  prisma,
  eventNumber,
  keyTitle,
}: StartEventType) {
  if (user.bot) return;

  await reaction.users.remove(user.id);

  //para ficar apenas uma reação no evento
  await reaction.users.remove(user.id);

  //atualizando campos do embed a partir do momento que o evento começa

  if (embed) {
    try {
      const event = await prisma.event.findFirst({
        where: {
          eventName: keyTitle,
        },
      });

      if (!event) {
        console.error(`${keyTitle} não encontrado!`);
        return;
      }

      const timeInitEvent = Date.now();

      await prisma.event.update({
        where: {
          id: event.id,
        },
        data: {
          status: "started",
          startTime: timeInitEvent,
        },
      });

      await prisma.participant.updateMany({
        where: {
          eventId: event.id,
        },
        data: {
          joinTime: timeInitEvent,
        },
      });

      await Promise.all([
        message.reactions.cache.get("🏁")?.remove(),
        message.reactions.cache.get("🛑")?.remove(),
        message.react("⏸"),
      ]);

      const updatedEmbed = new EmbedBuilder()
        .setTitle(`Evento ${eventNumber} Criado por ${user.username} - Iniciado!`)
        .addFields(embed.fields)
        .setColor("Green");

      await message.edit({ embeds: [updatedEmbed] });

      console.log(`${keyTitle} iniciado!`);
    } catch (error) {
      console.error("Error ao inserir o evento no banco de dados", error);
    }
  }
}
