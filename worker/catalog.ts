// Server-owned prices in USD cents. Never accept prices from the browser.
export const catalog: Record<string, { name: string; amount: number }> = {
  'supple-oud': { name: 'Supple Oud', amount: 2200 },
  'mint-moss': { name: 'Mint + Moss', amount: 2200 },
  'lithe-bloom': { name: 'Lithe Bloom', amount: 2200 },
  'morrow-trio': { name: 'The Morrow Trio', amount: 1100 },
};
export function validateCart(value: unknown): { id: string; quantity: number }[] {
  if (!Array.isArray(value) || !value.length || value.length > 4) throw new Error('Invalid cart');
  const seen = new Set<string>();
  return value.map(item => {
    if (!item || typeof item.id !== 'string' || !Object.hasOwn(catalog, item.id) || seen.has(item.id)
      || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 10) throw new Error('Invalid cart');
    seen.add(item.id);
    return { id: item.id, quantity: item.quantity };
  });
}
