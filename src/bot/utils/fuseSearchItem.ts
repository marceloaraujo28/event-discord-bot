import items from "../data/itemsLoader";
import Fuse from "fuse.js";

export function fuseSearchItem(search: string, tierInput: string | null): { itemName: string; itemId: string } | null {
  const fuse = new Fuse(items, {
    keys: ["LocalizedNames.PT-BR"],
    threshold: 0.4, // sensibilidade (quanto menor, mais estrito)
  });

  const results = fuse.search(search);
  const bestResults = results.map((r) => r.item);
  let itemId: string;

  //filtrar por tier
  if (tierInput) {
    const [tierNum, enchant] = tierInput.split(".").map(Number);
    const itemTierCorreto = bestResults.find((item) => item.UniqueName.startsWith(`T${tierNum}_`));

    if (!itemTierCorreto) return null;

    itemId = enchant > 0 ? `${itemTierCorreto.UniqueName}@${enchant}` : itemTierCorreto.UniqueName;

    return {
      itemName: itemTierCorreto.LocalizedNames["PT-BR"],
      itemId,
    };
  }

  const firstItem = bestResults[0];
  if (!firstItem) return null;

  itemId = firstItem.UniqueName;

  return {
    itemName: firstItem.LocalizedNames["PT-BR"],
    itemId,
  };
}
