import { EmbedBuilder } from "discord.js";
import { UpdateParticipationType } from "../types";
import { useT } from "../../utils/useT";

export async function UpdateParticipation({ interaction, prisma, event, guildData }: UpdateParticipationType) {
  await interaction.deferReply();

  const language = guildData.language;
  const t = useT(language);

  try {
    const message = await interaction.channel?.messages.fetch(event?.messageID ?? "");

    if (!message) {
      await interaction.editReply(t("updateParticipation.noMessage"));
      return;
    }

    const embed = message?.embeds[0];

    if (!embed) {
      return await interaction.editReply(t("updateParticipation.noEmbed"));
    }

    const user = interaction.options.get("membro")?.user;
    const updatedPercentage = interaction.options.get("participacao")?.value;
    const userId = user?.id || "";

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
    const updateParticipant = await prisma.participant.upsert({
      where: { userId_eventId: { userId, eventId: event.id } },
      update: { percentage: Number(updatedPercentage) },
      create: {
        userId,
        eventId: event.id,
        guildID: interaction.guild?.id || "",
        percentage: Number(updatedPercentage),
      },
    });

    // Verifica se o usuário foi atualizado com sucesso
    if (!updateParticipant) {
      console.error(
        "Erro ao atualizar a participação do usuário",
        userId,
        event.id,
        "na guild:",
        interaction.guild?.id
      );
      await interaction.editReply(t("updateParticipation.errorUpdateParticipation", { userId }));
      return;
    }

    // Busca os participantes atualizados no banco
    const updatedParticipants = await prisma.participant.findMany({
      where: { eventId: event.id },
    });

    // Formata a lista de participantes para o embed
    const participationList = updatedParticipants
      .map((participant) => `<@${participant.userId}> : ${participant.percentage}%`)
      .join("\n");

    const embedFields = [...embed.fields];
    embedFields[3] = {
      ...embedFields[3],
      value: participationList,
    };

    // Atualiza o embed mantendo os outros campos inalterados
    const updatedEmbed = new EmbedBuilder()
      .setTitle(embed.title)
      .addFields(embedFields)
      .setDescription(embed.description)
      .setColor("DarkButNotBlack");

    // Edita a mensagem com o embed atualizado
    await message.edit({ embeds: [updatedEmbed] });
    // await message.reply({ embeds: [updatedEmbed] });

    await interaction.editReply(
      t("updateParticipation.successUpdateParticipation", {
        interactionUserId: interaction.user.id,
        userId,
        updatedPercentage,
      })
    );
  } catch (error) {
    console.error("Erro ao atualizar participação", error);
    await interaction.editReply(t("updateParticipation.catchError"));
  }
}
