import { ColorResolvable, EmbedBuilder, MessageFlags } from "discord.js";
import { validateTier } from "../../utils/validateTier";
import { PriceType } from "../types";
import { fuseSearchItem } from "../../utils/fuseSearchItem";
import { useT } from "../../utils/useT";

type itemsReturnType = {
  item_id: string;
  city: string;
  quality: 2;
  sell_price_min: number;
  sell_price_min_date: string;
  sell_price_max: number;
  sell_price_max_date: string;
  buy_price_min: number;
  buy_price_min_date: string;
  buy_price_max: number;
  buy_price_max_date: string;
};

export async function Price({ interaction, prisma }: PriceType) {
  await interaction.deferReply();

  const item = interaction.options.get("item")?.value?.toString().trim();
  const tier = interaction.options.get("tier")?.value?.toString().trim();
  const city = interaction.options.get("cidade")?.value?.toString().trim();
  const server = interaction.options.get("servidor")?.value?.toString().trim();

  const servidor = server ? server : "west";

  let user;

  try {
    user = await prisma.user.findFirst({
      where: {
        userId: interaction.user.id,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar usuário no banco de dados:", error);
  }

  const language = user?.priceLanguage ?? interaction.locale;
  const t = useT(language);

  if (!item) {
    return await interaction.editReply(t("price.noItem"));
  }

  let tierValidate: string | null = null;

  if (tier) {
    tierValidate = validateTier(tier);
    if (!tierValidate)
      return interaction.editReply({
        content: t("price.invalidTier"),
      });
  }

  function formatTime(dateStr: string): string {
    const updatedUTC = new Date(dateStr);

    let updatedLocal;

    if (servidor === "west") {
      // Converte horário UTC da API para sua hora local (ex: UTC-3)
      updatedLocal = new Date(updatedUTC.getTime() - 3 * 60 * 60 * 1000);
    } else {
      updatedLocal = new Date(updatedUTC.getTime());
    }

    const now = new Date(); // Sua hora local
    let diffMs = now.getTime() - updatedLocal.getTime();
    if (diffMs < 0) diffMs = 0;

    const diffMin = Math.floor(diffMs / 1000 / 60);
    const h = Math.floor(diffMin / 60);
    const m = diffMin % 60;

    return `${h}h ${m}min`;
  }

  const fuseResult = fuseSearchItem(item, tierValidate, language);
  if (!fuseResult) {
    return await interaction.editReply(t("price.itemNotFound"));
  }

  const { itemId, itemName, color, tier: TierCompleted } = fuseResult;

  try {
    const result = await fetch(
      `https://${servidor}.albion-online-data.com/api/v2/stats/prices/${itemId}?locations=${
        city ? city : "3003,5003,2004,0007,3005,4002,1002,3008"
      }&qualities=1,2,3,4,5`
    );

    const data: itemsReturnType[] = await result.json();

    if (!data || data.length === 0) {
      return await interaction.editReply(t("price.itemNotFound2"));
    }

    const qualites = {
      1: t("price.qualities.normal"),
      2: t("price.qualities.good"),
      3: t("price.qualities.outstanding"),
      4: t("price.qualities.excellent"),
      5: t("price.qualities.masterpiece"),
    };

    const serversList: Record<string, string> = {
      west: "Americas(west)",
      east: "Asia(east)",
      europe: "Europe",
    };

    const sellItems = data.filter((i) => i.sell_price_min > 0);
    const buyItems = data.filter((i) => i.buy_price_max > 0);
    sellItems.sort((a, b) => a.sell_price_min - b.sell_price_min);
    buyItems.sort((a, b) => b.buy_price_max - a.buy_price_max);

    let citySellStr = "";
    let priceSellStr = "";
    let updateSellStr = "";

    let cityBuyStr = "";
    let priceBuyStr = "";
    let updateBuyStr = "";

    for (const item of sellItems) {
      citySellStr += `${item.city} (${qualites[item.quality]})\n`;
      priceSellStr += `${item.sell_price_min.toLocaleString("en-US")}\n`;
      updateSellStr += `${formatTime(item.sell_price_min_date)}\n`;
    }

    for (const item of buyItems) {
      cityBuyStr += `${item.city} (${qualites[item.quality]})\n`;
      priceBuyStr += `${item.buy_price_max.toLocaleString("en-US")}\n`;
      updateBuyStr += `${formatTime(item.buy_price_max_date)}\n`;
    }

    const embed = new EmbedBuilder()
      .setTitle(`⚔️ ${itemName} ${TierCompleted ? `- ${TierCompleted}` : ""} ⚔️ `)
      .setColor(`#${color}`)
      .setDescription(`🌐\`SERVER - ${serversList[servidor].toUpperCase()}\``)
      .setThumbnail(`https://render.albiononline.com/v1/item/${itemId}.png`)
      .addFields(
        { name: t("price.embed.sellOrders"), value: "\u200B", inline: false },
        { name: t("price.embed.city"), value: citySellStr || "N/A", inline: true },
        { name: t("price.embed.price"), value: priceSellStr || "N/A", inline: true },
        {
          name: `${t("price.embed.lastUpdate")} ${servidor !== "west" ? "(UTC)" : ""}`,
          value: updateSellStr || "N/A",
          inline: true,
        },
        { name: "\u200B", value: "----------------------", inline: false },
        { name: t("price.embed.buyOrders"), value: "\u200B", inline: false },
        { name: t("price.embed.city"), value: cityBuyStr || "N/A", inline: true },
        { name: t("price.embed.price"), value: priceBuyStr || "N/A", inline: true },
        {
          name: `${t("price.embed.lastUpdate")} ${servidor !== "west" ? "(UTC)" : ""}`,
          value: updateBuyStr || "N/A",
          inline: true,
        }
      )
      .setFooter({
        text: t("price.embed.footer"),
      });

    return await interaction.editReply({ embeds: [embed] });
  } catch (error) {
    console.log("Erro ao buscar items", error);
    return await interaction.editReply(t("price.catchError"));
  }
}
