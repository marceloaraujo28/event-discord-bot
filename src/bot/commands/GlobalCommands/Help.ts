import { EmbedBuilder } from "discord.js";
import { HelpType } from "../types";
import { useT } from "../../utils/useT";

export function Help({ interaction }: HelpType) {
  const language = interaction.locale;
  const t = useT(language);

  return new EmbedBuilder()
    .setColor("#0099ff")
    .setTitle(t("help.title"))
    .setDescription(t("help.description"))
    .addFields(
      {
        name: t("help.field1name"),
        value: t("help.field1value"),
      },
      {
        name: t("help.field2name"),
        value: t("help.field2value"),
      },
      {
        name: t("help.field3name"),
        value: t("help.field3value"),
      },
      {
        name: t("help.field4name"),
        value: t("help.field4value"),
      },
      {
        name: t("help.field5name"),
        value: t("help.field5value"),
      }
    )
    .setFooter({ text: t("help.footer") });
}
