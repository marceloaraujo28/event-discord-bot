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

  //faz verificação para ver se o usuário que clicou na reação para começar o evento é o mesmo quem criou o evento
  if (creatorName !== user.username) {
    return;
  }
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

      await prisma.event.update({
        where: {
          id: event.id,
        },
        data: {
          status: "started",
          startTime: Date.now(),
        },
      });

      const updateJoinTimeParticipants = await prisma.participant.updateMany({
        where: {
          eventId: event.id,
        },
        data: {
          joinTime: Date.now(),
        },
      });

      console.log(
        "Atualizado a entrada dos participantes no evento",
        updateJoinTimeParticipants
      );

      const updatedFields = embed.fields.map((field) => {
        if (field.name === "Ações") {
          return {
            ...field,
            value: "✅   Participar do evento\n\n⏸  Finalizar o evento",
          };
        }
        return field;
      });

      await Promise.all([
        message.reactions.cache.get("🏌️‍♀️")?.remove(),
        message.reactions.cache.get("🛑")?.remove(),
        message.react("⏸"),
      ]);

      const updatedEmbed = new EmbedBuilder()
        .setTitle(`Evento ${eventNumber} - em andamento!`)
        .addFields(updatedFields)
        .setDescription("Evento iniciado")
        .setColor("Green");

      await message.edit({ embeds: [updatedEmbed] });

      console.log(`${keyTitle} iniciado!`);
    } catch (error) {
      console.error("Error ao inserir o evento no banco de dados", error);
    }
  }
}
