import { EmbedBuilder } from "discord.js";
import { SellerType } from "./types";

export async function Seller({ interaction, prisma, event }: SellerType) {
  const membro = interaction.options.get("membro")?.user;

  await interaction.deferReply();

  try {
    const message = await interaction.channel?.messages.fetch(event?.messageID ?? "");

    if (!message) {
      await interaction.editReply("Canal do evento não existe!");
      return;
    }

    const embed = message?.embeds[0];

    if (!embed) {
      return await interaction.editReply("Evento não encontrado na sala!");
    }

    if (!membro) {
      return await interaction.editReply(`<@${interaction.user.id}> você precisa selecionar um membro válido`);
    }

    const updatedFields = embed.fields.map((field) => {
      if (field.name === "Vendedor") {
        return {
          ...field,
          value: `<@${membro.id}>`,
        };
      }

      return field;
    });

    const updatedEmbed = EmbedBuilder.from(embed).setFields(updatedFields);

    const otherEmbeds = message.embeds.slice(1);

    await message.edit({ embeds: [updatedEmbed, ...otherEmbeds] });
    await interaction.editReply(`<@${interaction.user.id}> vinculou <@${membro.id}> como vendedor do evento!`);

    await prisma.event.update({
      where: {
        id: event.id,
      },
      data: {
        seller: membro.id,
      },
    });
  } catch (error) {
    console.error("Error ao buscar evento no banco de dados, guild:", interaction?.guild?.id, error);
    return;
  }
}
