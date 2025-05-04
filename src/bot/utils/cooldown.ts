const userCooldowns = new Map<string, number>();

export function isInCooldown(userId: string, durationMs = 3000): boolean {
  const now = Date.now();
  const last = userCooldowns.get(userId);
  if (!last) return false;

  return now - last < durationMs;
}

export function setCooldown(userId: string): void {
  userCooldowns.set(userId, Date.now());
  setTimeout(() => userCooldowns.delete(userId), 2000);
}
