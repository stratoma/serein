export type AdminDelivery = { customer_name: string | null; customer_email: string | null; delivery_name: string | null; delivery_address: string | null };

export function deliveryLines(value: string | null): string[] {
  if (!value) return [];
  try {
    const address: unknown = JSON.parse(value);
    if (!address || typeof address !== 'object' || Array.isArray(address)) return [];
    const a = address as Record<string, unknown>;
    const field = (key: string) => typeof a[key] === 'string' ? (a[key] as string).trim() : '';
    return [field('line1'), field('line2'), [field('city'), [field('state'), field('postal_code')].filter(Boolean).join(' ')].filter(Boolean).join(', '), field('country')].filter(Boolean);
  } catch { return []; }
}
