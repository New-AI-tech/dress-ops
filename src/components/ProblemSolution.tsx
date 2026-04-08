import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function ProblemSolution() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const chaosRef = useRef<HTMLDivElement>(null);
  const clarityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(chaosRef.current, {
        x: -100,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: chaosRef.current,
          start: 'top 80%',
        },
      });

      gsap.from(clarityRef.current, {
        x: 100,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: clarityRef.current,
          start: 'top 80%',
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-24 px-6 bg-charcoal relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-6xl font-serif">From Chaos to <span className="text-gold italic">Couture Control</span></h2>
          <p className="text-ivory/50 max-w-2xl mx-auto font-light">
            Stop guessing. Start managing. FARYAL AL HOSARY transforms your boutique operations 
            from a spreadsheet graveyard into a digital command center.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Chaos Card */}
          <div 
            ref={chaosRef}
            className="glass p-8 md:p-12 rounded-[2rem] border-red-500/20 relative group overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <XCircle className="w-32 h-32 text-red-500" />
            </div>
            
            <div className="relative z-10 space-y-8">
              <div className="space-y-2">
                <span className="text-red-500 text-xs font-bold uppercase tracking-[0.2em]">The Old Way</span>
                <h3 className="text-3xl font-serif">The Spreadsheet Graveyard</h3>
              </div>

              <div className="aspect-video bg-red-500/5 rounded-2xl border border-red-500/10 p-6 flex items-center justify-center">
                <div className="grid grid-cols-4 gap-2 opacity-30">
                  {Array.from({ length: 12 }).map((_, i) => (
                    <div key={i} className="w-8 h-8 border border-red-500/30 flex items-center justify-center">
                      {i % 3 === 0 && <XCircle className="w-4 h-4 text-red-500" />}
                    </div>
                  ))}
                </div>
              </div>

              <ul className="space-y-4">
                {[
                  "Double-booked couture gowns for the same gala.",
                  "Where is dress #442B? Last seen 3 weeks ago.",
                  "Endless WhatsApp messages asking 'Is this available?'"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-ivory/60 font-light">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Clarity Card */}
          <div 
            ref={clarityRef}
            className="glass p-8 md:p-12 rounded-[2rem] border-gold/20 relative group overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
              <CheckCircle className="w-32 h-32 text-gold" />
            </div>

            <div className="relative z-10 space-y-8">
              <div className="space-y-2">
                <span className="text-gold text-xs font-bold uppercase tracking-[0.2em]">The FARYAL AL HOSARY Way</span>
                <h3 className="text-3xl font-serif">The Command Center</h3>
              </div>

              <div className="aspect-video bg-gold/5 rounded-2xl border border-gold/10 p-6">
                <div className="flex flex-col gap-4">
                  <div className="h-2 w-full bg-gold/20 rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-gold animate-pulse" />
                  </div>
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gold/60">
                    <span>Available</span>
                    <span>Reserved</span>
                    <span>Cleaning</span>
                  </div>
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 14 }).map((_, i) => (
                      <div key={i} className={`h-4 rounded-sm ${i < 5 ? 'bg-gold/40' : i < 8 ? 'bg-gold' : 'bg-gold/10'}`} />
                    ))}
                  </div>
                </div>
              </div>

              <ul className="space-y-4">
                {[
                  "Live Availability Dashboard with 30-second sync.",
                  "Full garment lifecycle tracking (Condition reports, Alterations status).",
                  "Client self-service portal for viewing appointments."
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-ivory/80 font-light">
                    <CheckCircle className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
