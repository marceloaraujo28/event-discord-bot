import { EmbedBuilder } from "discord.js";
import { UpdateLanguageType } from "../types";
import { useT } from "../../utils/useT";
import languages from "../../utils/languages";

export async function UpdateLanguage({ interaction, prisma, guildData }: UpdateLanguageType) {
  await interaction.deferReply();
  const language = interaction.options.get("idioma")?.value as string;
  const languageName = languages[language];
  const embed = new EmbedBuilder();

  const languageDataBase = guildData.language;
  const t = useT(languageDataBase);

  try {
    await prisma.guilds.update({
      where: {
        guildID: interaction.guildId ?? "",
      },
      data: {
        language,
      },
    });

    embed.setTitle("language updated successfully");
    embed.setDescription(`Language updated to ${languageName}`);
    embed.setThumbnail("https://i.ibb.co/6jNgbzf/Sem-T-tulo-1.png");
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
    return await interaction.editReply(t("updateLanguage.updateError"));
  }
}
