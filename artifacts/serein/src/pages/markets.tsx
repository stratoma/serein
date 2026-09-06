import { Link } from "wouter";

const events = [
  { name: "Lagos Handcraft Fair", location: "Victoria Island Community Centre", date: "2026-07-12" },
  { name: "The Makers Market", location: "Lekki Phase 1", date: "2026-08-02" },
  { name: "Craft & Co. Pop-Up", location: "Ikoyi Arts Quarter", date: "2026-08-23" },
];

const formatDate = (date: string) => new Intl.DateTimeFormat("en-US", { month: "long", day: "numeric", year: "numeric" }).format(new Date(`${date}T12:00:00`));

export default function Markets() {
  const today = new Date();
  const upcoming = events.filter((event) => new Date(`${event.date}T23:59:59`) >= today);
  const past = events.filter((event) => new Date(`${event.date}T23:59:59`) < today);

  return (
    <main className="min-h-screen bg-background px-8 pb-24 pt-40 md:px-16">
      <div className="mx-auto max-w-5xl">
        <Link href="/#markets" className="text-[9px] uppercase tracking-[0.25em] text-foreground/40 hover:text-primary">← Back to Serein</Link>
        <div className="mt-12 max-w-3xl"><span className="text-[10px] uppercase tracking-[0.25em] text-foreground/40">Find us</span><h1 className="mt-5 font-serif text-6xl leading-none text-primary md:text-8xl">The market calendar.</h1><p className="mt-8 max-w-[42ch] text-base leading-relaxed text-foreground/55">Meet Serein in person, discover a new ritual, and say hello to the people who make each batch by hand.</p></div>
        <section className="mt-20"><h2 className="font-serif text-3xl text-primary">Upcoming</h2><div className="mt-8 border-t border-foreground/10">{upcoming.length ? upcoming.map((event) => <div key={event.date} className="flex flex-col justify-between gap-3 border-b border-foreground/10 py-8 sm:flex-row sm:items-end"><div><h3 className="font-serif text-2xl text-primary">{event.name}</h3><p className="mt-2 text-sm text-foreground/45">{event.location}</p></div><p className="font-serif italic text-lg text-foreground/55">{formatDate(event.date)}</p></div>) : <p className="py-8 text-foreground/50">No upcoming markets are scheduled yet. Join the list for first notice.</p>}</div></section>
        {past.length > 0 && <section className="mt-20 opacity-60"><h2 className="font-serif text-3xl text-primary">Past markets</h2><div className="mt-8 border-t border-foreground/10">{past.map((event) => <div key={event.date} className="flex flex-col justify-between gap-3 border-b border-foreground/10 py-6 sm:flex-row"><div><h3 className="font-serif text-xl text-primary">{event.name}</h3><p className="mt-1 text-sm text-foreground/45">{event.location}</p></div><p className="font-serif italic text-base text-foreground/45">{formatDate(event.date)}</p></div>)}</div></section>}
      </div>
    </main>
  );
}
