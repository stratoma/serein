import { LayoutDashboard, Mail, Package, ShoppingBag, Store, Users, ShieldCheck, Settings, MapPin } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import type { ReactNode } from 'react';

const links = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/manage-products', label: 'Products', icon: Package },
  { href: '/manage-orders', label: 'Orders', icon: ShoppingBag },
  { href: '/manage-customers', label: 'Customers', icon: Users },
  { href: '/manage-markets', label: 'Markets', icon: MapPin },
  { href: '/manage-users', label: 'Users', icon: ShieldCheck },
  { href: '/email-logs', label: 'Email logs', icon: Mail },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export function AdminLayout({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <div className="min-h-screen bg-background md:flex">
    <aside className="border-b border-foreground/10 bg-[#f9f5ee] px-5 py-5 md:sticky md:top-0 md:h-screen md:w-56 md:shrink-0 md:border-b-0 md:border-r md:px-4 md:py-8">
      <Link href="/dashboard" className="block px-2 font-serif text-2xl tracking-[0.18em] text-primary">SEREIN</Link>
      <p className="mt-5 px-2 text-[10px] uppercase tracking-[0.2em] text-foreground/45">Administration</p>
      <nav aria-label="Administration" className="mt-3 flex flex-wrap gap-1 md:flex-col">{links.map(({ href, label, icon: Icon }) => <Link key={href} href={href} aria-current={location === href ? 'page' : undefined} className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm ${location === href ? 'bg-primary text-primary-foreground' : 'text-foreground/70 hover:bg-foreground/5'}`}><Icon size={17} aria-hidden="true" />{label}</Link>)}</nav>
      <Link href="/" className="mt-5 flex items-center gap-3 px-3 py-2 text-sm text-foreground/55 hover:text-primary md:mt-10"><Store size={17} aria-hidden="true" />View storefront</Link>
    </aside>
    <div className="min-w-0 flex-1">{children}</div>
  </div>;
}
