import { EmbedBuilder } from "discord.js";
import { StartEventType } from "./types";

export async function StartEvent({
  user,
  reaction,
  creatorName,
  message,
  embed,
  eventCounter,
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
  const updatedFields = embed.fields.map((field) => {
    if (field.name === "Ações") {
      return {
        ...field,
        value: "✅   Participar do evento\n\n⏸  Finalizar o evento",
      };
    }
    return field;
  });

  if (embed) {
    await Promise.all([
      message.reactions.cache.get("🏌️‍♀️")?.remove(),
      message.reactions.cache.get("🛑")?.remove(),
      message.react("⏸"),
    ]);

    const updatedEmbed = new EmbedBuilder()
      .setTitle(`Evento ${eventCounter} - em andamento!`)
      .addFields(updatedFields)
      .setDescription("Evento iniciado")
      .setColor("Green");

    await message.edit({ embeds: [updatedEmbed] });
  }
}
