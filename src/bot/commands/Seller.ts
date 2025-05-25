import { EmbedBuilder } from "discord.js";
import { SellerType } from "./types";
import { useT } from "../utils/useT";

export async function Seller({ interaction, prisma, event, guildData }: SellerType) {
  const membro = interaction.options.get("membro")?.user;

  const language = guildData.language;
  const t = useT(language);

  await interaction.deferReply();

  if (event.status !== "finished") {
    await interaction.editReply(t("seller.eventNoFinished"));
    return;
  }

  try {
    const message = await interaction.channel?.messages.fetch(event?.messageID ?? "");

    if (!message) {
      await interaction.editReply(t("seller.noChannel"));
      return;
    }

    const embed = message?.embeds[0];

    if (!embed) {
      return await interaction.editReply(t("seller.eventNotFound"));
    }

    if (!membro) {
      return await interaction.editReply(
        t("seller.noMember", {
          interactionUser: interaction.user.id,
        })
      );
    }

    const updateEmbedFields = [...embed.fields];
    updateEmbedFields[0] = {
      ...updateEmbedFields[0],
      value: `<@${membro.id}>`,
    };

    const updatedEmbed = EmbedBuilder.from(embed).setFields(updateEmbedFields);

    const otherEmbeds = message.embeds.slice(1);

    await message.edit({ embeds: [updatedEmbed, ...otherEmbeds] });
    await interaction.editReply(
      t("seller.sellerVinculated", {
        memberId: membro.id,
        interactionUser: interaction.user.id,
      })
    );

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
    return await interaction.editReply(t("seller.errorVinculated"));
  }
}
