import { Link } from "wouter";
import { useState, type FormEvent } from "react";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubscribed(true);
  }

  return (
    <footer className="bg-primary text-primary-foreground py-24 px-8 md:px-16">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 mb-20">

          <div className="lg:col-span-1">
            <h2 className="text-2xl font-serif mb-5 tracking-[0.15em]">Serein</h2>
            <p className="text-primary-foreground/40 font-serif italic text-base leading-relaxed max-w-[22ch]">
              Transform. Root. Become.
            </p>
            <p className="mt-3 text-primary-foreground/25 font-sans text-[10px] uppercase tracking-[0.2em]">
              Made with intention. Shared with care.
            </p>
            <div className="mt-8">
              <a href="https://www.instagram.com/serein.skin" target="_blank" rel="noreferrer" className="text-[10px] uppercase tracking-[0.2em] text-primary-foreground/30 hover:text-primary-foreground/70 transition-colors duration-400 font-sans">
                @serein.skin
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-[10px] uppercase tracking-[0.25em] font-sans text-primary-foreground/30 mb-8">Explore</h3>
            <ul className="space-y-5 text-sm text-primary-foreground/50 font-sans">
              <li><a href="/#collection" className="hover:text-primary-foreground/90 transition-colors duration-300">Collection</a></li>
              <li><a href="/#ingredients" className="hover:text-primary-foreground/90 transition-colors duration-300">Ingredients</a></li>
              <li><a href="/#morrow-trio" className="hover:text-primary-foreground/90 transition-colors duration-300">The Morrow Trio</a></li>
              <li><a href="/#markets" className="hover:text-primary-foreground/90 transition-colors duration-300">Markets</a></li>
              <li><a href="/#story" className="hover:text-primary-foreground/90 transition-colors duration-300">About</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] uppercase tracking-[0.25em] font-sans text-primary-foreground/30 mb-8">Stay close.</h3>
            <p className="text-xs text-primary-foreground/40 font-sans leading-relaxed mb-6 max-w-[26ch]">
              New batches and quiet news, when it matters.
            </p>
            {subscribed ? (
              <p className="border-t border-primary-foreground/15 pt-4 text-sm font-serif italic text-primary-foreground/70" role="status">You’re on the list. We’ll be in touch when there’s something worth sharing.</p>
            ) : <form className="flex flex-col space-y-4" onSubmit={handleSubmit}>
              <label htmlFor="footer-email" className="sr-only">Email address</label>
              <input
                id="footer-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                placeholder="Enter your email"
                className="bg-transparent border-b border-primary-foreground/15 py-2 px-0 text-sm font-sans focus:outline-none focus:border-primary-foreground/40 placeholder:text-primary-foreground/25 transition-colors duration-300"
                required
              />
              <button
                type="submit"
                className="text-left text-[10px] uppercase tracking-[0.25em] text-primary-foreground/40 hover:text-primary-foreground/70 transition-colors duration-400 font-sans pt-1"
              >
                Subscribe
              </button>
            </form>}
          </div>
        </div>

        <div className="pt-8 border-t border-primary-foreground/8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-primary-foreground/25 font-sans uppercase tracking-[0.15em]">
          <p>&copy; {new Date().getFullYear()} Serein</p>
          <div className="flex space-x-8">
            <Link href="/privacy" className="hover:text-primary-foreground/50 transition-colors duration-300">Privacy</Link>
            <Link href="/shipping" className="hover:text-primary-foreground/50 transition-colors duration-300">Shipping</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
