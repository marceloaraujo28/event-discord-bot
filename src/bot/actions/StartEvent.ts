import { EmbedBuilder } from "discord.js";
import { StartEventType } from "./types";
import { useT } from "../utils/useT";

export async function StartEvent({
  user,
  reaction,
  message,
  embed,
  prisma,
  eventNumber,
  keyTitle,
  guildData,
}: StartEventType) {
  if (user.bot) return;

  const language = guildData.language;
  const t = useT(language);

  //atualizando campos do embed a partir do momento que o evento começa

  if (embed) {
    try {
      //para ficar apenas uma reação no evento
      await reaction.users.remove(user.id);

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
        .setTitle(
          t("startEvent.embed.title", {
            eventNumber,
            userName: user.username,
          })
        )
        .setDescription(embed.description)
        .addFields(embed.fields)
        .setColor("Green");

      await message.edit({ embeds: [updatedEmbed] });

      console.log(`[${keyTitle}] ${user.username} (${user.id}) iniciou o evento em ${reaction.message.guild?.name}`);
    } catch (error) {
      console.error(`Error ao inserir ${keyTitle} no banco de dados`, error);
      return;
    }
  }
}
