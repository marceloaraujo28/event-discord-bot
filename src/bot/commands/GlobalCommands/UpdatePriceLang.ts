import { EmbedBuilder, MessageFlags } from "discord.js";
import languages from "../../utils/languages";
import { UpdatePriceLangType } from "../types";

export async function UpdatePriceLang({ interaction, prisma }: UpdatePriceLangType) {
  await interaction.deferReply({ flags: MessageFlags.Ephemeral });
  const language = interaction.options.get("idioma")?.value as string;
  const languageName = languages[language];
  const embed = new EmbedBuilder();

  try {
    const guild = await prisma.guilds.findFirst({
      where: {
        guildID: interaction.guildId ?? "",
      },
    });

    if (!guild) {
      await prisma.guilds.create({
        data: {
          guildID: interaction.guildId ?? "",
          language: interaction.locale,
        },
      });
    }

    await prisma.user.upsert({
      where: {
        userId_guildID: {
          userId: interaction.user.id,
          guildID: interaction.guildId ?? "",
        },
      },
      update: {
        priceLanguage: language,
      },
      create: {
        userId: interaction.user.id,
        guildID: interaction.guildId ?? "",
        priceLanguage: language,
      },
    });

    embed.setTitle("Market bot language updated successfully");
    embed.setDescription(`Language updated to ${languageName}`);
    embed.setThumbnail("https://cdn.discordapp.com/avatars/1272188978765893714/dadee0975ad1b9c9cf65c51290dabaa6.png");
    embed.setFields([
      {
        name: "Current Language:",
        value: languageName,
      },
    ]);
    embed.setColor("Green");

    return await interaction.editReply({
      embeds: [embed],
    });
  } catch (error) {
    console.error(error);
    return await interaction.editReply("Error updating language, contact the support");
  }
}
