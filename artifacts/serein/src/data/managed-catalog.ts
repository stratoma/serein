import { useEffect, useState } from 'react';
export type CatalogProduct = { id: string; name: string; amount: number; description: string; image_url: string; stock: number | null };
export function useManagedCatalog() {
  const [products, setProducts] = useState<CatalogProduct[] | null>(null);
  useEffect(() => { let live = true; fetch('/api/products', { cache: 'no-store' }).then(response => { if (!response.ok) throw new Error(); return response.json(); }).then(data => { if (live) setProducts(data.products); }).catch(() => { if (live) setProducts([]); }); return () => { live = false; }; }, []);
  return products;
}
export const catalogPrice = (amount: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount / 100);
export const available = (product: CatalogProduct | undefined) => !!product && (product.stock === null || product.stock > 0);
