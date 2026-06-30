import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-20 px-6 md:px-12">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-serif mb-6 tracking-wide">SEREIN</h2>
            <p className="text-primary-foreground/70 mb-8 max-w-sm font-serif italic text-lg">
              Transform. Root. Become.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm">
                Instagram (@serein.skin)
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-serif text-lg mb-6 tracking-wider">Explore</h3>
            <ul className="space-y-4 text-sm text-primary-foreground/70">
              <li><a href="#collection" className="hover:text-primary-foreground transition-colors">Collection</a></li>
              <li><a href="#story" className="hover:text-primary-foreground transition-colors">Our Story</a></li>
              <li><a href="#markets" className="hover:text-primary-foreground transition-colors">Markets</a></li>
              <li><a href="#journal" className="hover:text-primary-foreground transition-colors">Journal</a></li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg mb-6 tracking-wider">Newsletter</h3>
            <p className="text-sm text-primary-foreground/70 mb-4 leading-relaxed">
              Quiet rituals and new batches, delivered thoughtfully.
            </p>
            <form className="flex flex-col space-y-3" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-transparent border-b border-primary-foreground/20 py-2 px-0 text-sm focus:outline-none focus:border-primary-foreground placeholder:text-primary-foreground/40 transition-colors"
                required
              />
              <button 
                type="submit" 
                className="text-left text-sm uppercase tracking-widest text-primary-foreground hover:text-primary-foreground/70 transition-colors pt-2"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-xs text-primary-foreground/50">
          <p>&copy; {new Date().getFullYear()} SEREIN. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="hover:text-primary-foreground transition-colors">Privacy Policy</Link>
            <Link href="/shipping" className="hover:text-primary-foreground transition-colors">Shipping & Returns</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
