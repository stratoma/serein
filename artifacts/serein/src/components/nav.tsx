import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Menu, X, ShoppingBag, UserRound } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/cart-context";
import { useAuth } from "@/context/auth-context";

export function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { itemCount, setIsOpen } = useCart();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isMobileMenuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMobileMenuOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [isMobileMenuOpen]);

  const navLinks = [
    { name: "Collection", href: "/#collection", isAnchor: true },
    { name: "Ingredients", href: "/ingredients", isAnchor: false },
    { name: "The Morrow Trio", href: "/#morrow-trio", isAnchor: true },
    { name: "Markets", href: "/#markets", isAnchor: true },
    { name: "About", href: "/#story", isAnchor: true },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${
        isScrolled
        ? "bg-background/96 backdrop-blur-sm py-4"
          : "bg-black/15 py-7"
      }`}
    >
      <div className="container mx-auto px-8 md:px-14 flex items-center justify-between">
        <Link href="/" className={`text-base font-serif tracking-[0.3em] z-50 relative uppercase ${isScrolled ? "text-primary" : "text-white"}`}>
          Serein
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-10">
          {navLinks.map((link) =>
            link.isAnchor ? (
              <a
                key={link.name}
                href={link.href}
                className={`text-[10px] uppercase tracking-[0.2em] hover:text-primary transition-colors duration-300 font-sans ${isScrolled ? "text-foreground/70" : "text-white/80"}`}
              >
                {link.name}
              </a>
            ) : (
              <Link
                key={link.name}
                href={link.href}
                className={`text-[10px] uppercase tracking-[0.2em] hover:text-primary transition-colors duration-300 font-sans ${isScrolled ? "text-foreground/70" : "text-white/80"}`}
              >
                {link.name}
              </Link>
            )
          )}
          {user ? (
            <button type="button" onClick={() => void signOut()} className={`flex items-center space-x-1.5 text-[10px] uppercase tracking-[0.2em] hover:text-primary transition-colors duration-300 ${isScrolled ? "text-foreground/70" : "text-white/80"}`}>
              <UserRound className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Sign out</span>
            </button>
          ) : (
            <Link href="/auth" className={`flex items-center space-x-1.5 text-[10px] uppercase tracking-[0.2em] hover:text-primary transition-colors duration-300 ${isScrolled ? "text-foreground/70" : "text-white/80"}`}>
              <UserRound className="w-3.5 h-3.5" strokeWidth={1.5} />
              <span>Sign in</span>
            </Link>
          )}
          <button type="button" onClick={() => setIsOpen(true)} aria-label={`Open cart${itemCount ? `, ${itemCount} item${itemCount === 1 ? "" : "s"}` : ""}`} className={`flex items-center space-x-1.5 text-[10px] uppercase tracking-[0.2em] hover:text-primary transition-colors duration-300 ${isScrolled ? "text-foreground/70" : "text-white/80"}`}>
            <ShoppingBag className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>Cart{itemCount > 0 ? ` (${itemCount})` : ""}</span>
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center space-x-5 z-50 relative">
          <button type="button" aria-label={`Open cart${itemCount ? `, ${itemCount} item${itemCount === 1 ? "" : "s"}` : ""}`} onClick={() => setIsOpen(true)} className={`transition-colors ${isScrolled ? "text-primary/70" : "text-white/85"} hover:text-primary`}>
            <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            aria-label={isMobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary ${isScrolled ? "text-primary/70" : "text-white/85"} hover:text-primary`}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" strokeWidth={1.5} /> : <Menu className="w-5 h-5" strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            id="mobile-navigation"
            className="absolute top-0 left-0 w-full h-screen bg-background pt-28 px-8 flex flex-col space-y-10"
          >
            {navLinks.map((link, i) =>
              link.isAnchor ? (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 + 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-4xl font-serif text-primary leading-none"
                >
                  {link.name}
                </motion.a>
              ) : (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 + 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-4xl font-serif text-primary leading-none"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              )
            )}
            {user ? (
              <motion.button
                type="button"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.07 + 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  void signOut();
                }}
                className="text-left text-4xl font-serif text-primary leading-none"
              >
                Sign out
              </motion.button>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.07 + 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href="/auth"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-4xl font-serif text-primary leading-none"
                >
                  Sign in
                </Link>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
