import { UpdateLanguageType } from "../types";

export async function UpdateLanguage({ interaction, prisma }: UpdateLanguageType) {
  const language = interaction.options.get("idioma")?.value as string;

  try {
    await prisma.guilds.update({
      where: {
        guildID: interaction.guildId ?? "",
      },
      data: {
        language,
      },
    });

    await interaction.reply({
      content: `Language updated to ${language}`,
      ephemeral: true,
    });
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "An error occurred while updating the language.",
      ephemeral: true,
    });
  }
}
