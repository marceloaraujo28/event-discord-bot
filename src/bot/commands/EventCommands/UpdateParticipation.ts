import { EmbedBuilder } from "discord.js";
import { UpdateParticipationType } from "../types";

export async function UpdateParticipation({ interaction, prisma, event }: UpdateParticipationType) {
  await interaction.deferReply();

  const message = await interaction.channel?.messages.fetch(event?.messageID ?? "");

  if (!message) {
    await interaction.editReply("Mensagens do canal do evento foram excluídas!");
    return;
  }

  const embed = message?.embeds[0];

  if (!embed) {
    return await interaction.editReply("Evento não encontrado na sala!");
  }

  const user = interaction.options.get("membro")?.user;
  const updatedPercentage = interaction.options.get("participacao")?.value;
  const userId = user?.id || "";

  try {
    //cadastrando user no banco de dados caso não exista
    const userTable = await prisma.user.findUnique({
      where: {
        userId_guildID: {
          guildID: interaction.guild?.id ?? "",
          userId: userId,
        },
      },
    });

    if (!userTable) {
      await prisma.user.create({
        data: {
          userId: userId,
          guildID: interaction.guild?.id ?? "",
        },
      });
    }

    // Atualiza ou adiciona o participante no banco de dados
    await prisma.participant.upsert({
      where: { userId_eventId: { userId, eventId: event.id } },
      update: { percentage: Number(updatedPercentage) },
      create: {
        userId,
        eventId: event.id,
        guildID: interaction.guild?.id || "",
        percentage: Number(updatedPercentage),
      },
    });

    // Busca os participantes atualizados no banco
    const updatedParticipants = await prisma.participant.findMany({
      where: { eventId: event.id },
    });

    // Formata a lista de participantes para o embed
    const participationList = updatedParticipants
      .map((participant) => `<@${participant.userId}> : ${participant.percentage}%`)
      .join("\n");

    // Atualiza o embed mantendo os outros campos inalterados
    const updatedEmbed = new EmbedBuilder()
      .setTitle(embed.title)
      .addFields(
        embed.fields
          .filter((field) => field.name !== "Ações")
          .map((field) => {
            if (field.name === "Participantes") {
              return {
                ...field,
                value: participationList,
              };
            }

            return field;
          })
      )
      .setDescription(embed.description)
      .setColor("DarkButNotBlack");

    // Edita a mensagem com o embed atualizado
    await message.edit({ embeds: [updatedEmbed] });
    // await message.reply({ embeds: [updatedEmbed] });

    await interaction.editReply(
      `<@${interaction.user.id}> atualizou a participação de <@${userId}> para ${updatedPercentage}%!`
    );
  } catch (error) {
    console.error("Erro ao atualizar participação", error);
    await interaction.editReply("Erro ao atualizar participação");
  }
}
