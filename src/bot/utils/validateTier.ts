export function validateTier(tierInput: string | undefined) {
  if (!tierInput) return null;

  // Corrigir entrada tipo "5" => "5.0"
  if (/^[1-8]$/.test(tierInput)) {
    return `${tierInput}.0`;
  }

  // Verifica se está no formato certo tipo 4.2
  const match = tierInput.match(/^([1-8])\.([0-4])$/);
  if (!match) return null;

  const tierNum = parseInt(match[1]);
  const enchant = parseInt(match[2]);

  // Verifica se o tier está entre 1 e 8
  if (tierNum < 1 || tierNum > 8) return null;

  // Tiers 1–3 não têm encantamento, forçamos para 0
  if (tierNum <= 3) return `${tierNum}.0`;

  return `${tierNum}.${enchant}`;
}
