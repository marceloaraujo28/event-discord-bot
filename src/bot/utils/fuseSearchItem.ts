import items from "../data/itemsLoader";
import Fuse from "fuse.js";

export function fuseSearchItem(
  search: string,
  tierInput: string | null,
  language: string
): { itemName: string; itemId: string; color: string; tier?: string } | null {
  const languages: Record<string, string> = {
    de: "DE-DE",
    "en-US": "EN-US",
    "es-ES": "ES-ES",
    fr: "FR-FR",
    id: "ID-ID",
    it: "IT-IT",
    ja: "JA-JP",
    ko: "KO-KR",
    pl: "PL-PL",
    "pt-BR": "PT-BR",
    ru: "RU-RU",
    tr: "TR-TR",
    "zh-CN": "ZH-CN",
    "zh-TW": "ZH-TW",
  };

  const key = `LocalizedNames.${languages[language]}`;

  const fuse = new Fuse(items, {
    keys: [key],
    threshold: 0.4, // sensibilidade (quanto menor, mais estrito)
  });

  const results = fuse.search(search);
  const bestResults = results.map((r) => r.item);
  let itemId: string;

  const colors: Record<number, string> = {
    1: "64FE2E",
    2: "00FFFF",
    3: "F781F3",
    4: "FFFF00",
  };

  //filtrar por tier
  if (tierInput) {
    const [tierNum, enchant] = tierInput.split(".").map(Number);

    const itemTierCorreto = bestResults.find((item) => {
      if (enchant > 0) {
        return item.UniqueName.startsWith(`T${tierNum}_`) && item.UniqueName.endsWith(`@${enchant}`);
      }

      return item.UniqueName.startsWith(`T${tierNum}_`);
    });

    if (!itemTierCorreto) return null;

    itemId = itemTierCorreto.UniqueName;

    return {
      itemName: itemTierCorreto.LocalizedNames[languages[language]],
      itemId,
      color: enchant > 0 ? colors[enchant] : "696969",
      tier: `${tierNum}.${enchant}`,
    };
  }

  const firstItem = bestResults[0];
  if (!firstItem) return null;

  itemId = firstItem.UniqueName;

  const enchantPart = itemId.includes("@") ? itemId.split("@").pop() : null;

  return {
    itemName: firstItem.LocalizedNames[languages[language]],
    itemId,
    color: enchantPart ? colors[Number(enchantPart)] : "696969",
  };
}
