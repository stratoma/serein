import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Menu, X, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Collection", href: "#collection", isAnchor: true },
    { name: "Ingredients", href: "/ingredients", isAnchor: false },
    { name: "The Morrow Trio", href: "#morrow-trio", isAnchor: true },
    { name: "Markets", href: "#markets", isAnchor: true },
    { name: "About", href: "#story", isAnchor: true },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-700 ${
        isScrolled
          ? "bg-background/96 backdrop-blur-sm py-4"
          : "bg-transparent py-7"
      }`}
    >
      <div className="container mx-auto px-8 md:px-14 flex items-center justify-between">
        <Link href="/" className="text-base font-serif tracking-[0.3em] text-primary z-50 relative uppercase">
          Serein
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-10">
          {navLinks.map((link) =>
            link.isAnchor ? (
              <a
                key={link.name}
                href={link.href}
                className="text-[10px] uppercase tracking-[0.2em] text-foreground/60 hover:text-primary transition-colors duration-300 font-sans"
              >
                {link.name}
              </a>
            ) : (
              <Link
                key={link.name}
                href={link.href}
                className="text-[10px] uppercase tracking-[0.2em] text-foreground/60 hover:text-primary transition-colors duration-300 font-sans"
              >
                {link.name}
              </Link>
            )
          )}
          <button className="flex items-center space-x-1.5 text-[10px] uppercase tracking-[0.2em] text-foreground/60 hover:text-primary transition-colors duration-300">
            <ShoppingBag className="w-3.5 h-3.5" strokeWidth={1.5} />
            <span>Cart</span>
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center space-x-5 z-50 relative">
          <button className="text-primary/70 hover:text-primary transition-colors">
            <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-primary/70 hover:text-primary transition-colors focus:outline-none"
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
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
