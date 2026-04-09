import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ShoppingBag, ChevronRight } from 'lucide-react';

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const dressRef = useRef<SVGSVGElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Fade in text
      gsap.from('.hero-text', {
        y: 50,
        opacity: 0,
        duration: 1.2,
        stagger: 0.2,
        ease: 'power4.out',
      });

      // Floating dress animation
      gsap.to(dressRef.current, {
        y: 20,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // Rotating dress silhouette
      gsap.to('.dress-path', {
        strokeDashoffset: 0,
        duration: 3,
        ease: 'power2.inOut',
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-6"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold/10 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-template-columns-[1.2fr_1fr] gap-12 items-center relative z-10">
        <div ref={textRef} className="space-y-8">
          <div className="hero-text inline-flex items-center gap-2 px-4 py-2 rounded-full glass border-gold/20 text-gold text-xs font-bold uppercase tracking-[0.2em]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-gold"></span>
            </span>
            Enterprise Dress Management
          </div>
          
          <h1 className="hero-text text-6xl md:text-8xl font-serif font-medium leading-[0.9] tracking-tighter">
            Every Dress. <br />
            <span className="text-gradient-gold italic">Every Date.</span> <br />
            Perfectly Orchestrated.
          </h1>
          
          <p className="hero-text text-lg md:text-xl text-ivory/60 max-w-xl leading-relaxed font-light">
            Eliminate double bookings and lost inventory. FARYAL AL HOSARY provides an 
            enterprise-grade reservation system for luxury dress rental houses, stylists, and ateliers.
          </p>

          <div className="hero-text flex flex-wrap gap-4 pt-4">
            <Link 
              to="/inventory"
              className="bg-gold hover:bg-gold-light text-charcoal px-8 py-4 rounded-full text-sm font-bold transition-all transform hover:scale-105 flex items-center gap-2 uppercase tracking-widest group"
            >
              Manage Your Inventory
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/calendar"
              className="px-8 py-4 rounded-full text-sm font-bold border border-ivory/20 hover:border-gold hover:text-gold transition-all uppercase tracking-widest"
            >
              See Live Demo Calendar
            </Link>
          </div>

          <div className="hero-text pt-8 flex items-center gap-4 text-xs font-medium text-ivory/40 uppercase tracking-widest">
            <div className="h-[1px] w-12 bg-ivory/20" />
            Real-time sync across all stylists and boutiques
          </div>
        </div>

        <div className="relative flex justify-center items-center">
          {/* Abstract Dress Silhouette SVG */}
          <svg
            ref={dressRef}
            viewBox="0 0 200 300"
            className="w-full max-w-[400px] drop-shadow-[0_0_30px_rgba(212,175,55,0.2)]"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="dress-path"
              d="M100 20C80 20 70 40 60 60C50 80 40 100 30 150C20 200 10 250 10 280H190C190 250 180 200 170 150C160 100 150 80 140 60C130 40 120 20 100 20Z"
              stroke="url(#goldGradient)"
              strokeWidth="1"
              strokeDasharray="1000"
              strokeDashoffset="1000"
            />
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#D4AF37" />
                <stop offset="50%" stopColor="#F5F5F0" />
                <stop offset="100%" stopColor="#D4AF37" />
              </linearGradient>
            </defs>
            
            {/* Calendar Grid Overlay Effect */}
            <g opacity="0.1">
              {Array.from({ length: 10 }).map((_, i) => (
                <line key={`v-${i}`} x1={i * 20} y1="0" x2={i * 20} y2="300" stroke="white" strokeWidth="0.5" />
              ))}
              {Array.from({ length: 15 }).map((_, i) => (
                <line key={`h-${i}`} x1="0" y1={i * 20} x2="200" y2={i * 20} stroke="white" strokeWidth="0.5" />
              ))}
            </g>

            {/* Glowing Badges */}
            <circle cx="60" cy="120" r="4" fill="#D4AF37">
              <animate attributeName="opacity" values="0.2;1;0.2" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="140" cy="180" r="4" fill="#D4AF37">
              <animate attributeName="opacity" values="0.2;1;0.2" dur="2.5s" repeatCount="indefinite" />
            </circle>
            <circle cx="100" cy="240" r="4" fill="#D4AF37">
              <animate attributeName="opacity" values="0.2;1;0.2" dur="3s" repeatCount="indefinite" />
            </circle>
          </svg>

          {/* Floating Status Cards */}
          <div className="absolute top-10 right-0 glass p-3 rounded-xl border-gold/30 animate-bounce-slow">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Available</span>
            </div>
          </div>
          <div className="absolute bottom-20 left-0 glass p-3 rounded-xl border-gold/30 animate-bounce-slow" style={{ animationDelay: '1s' }}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-gold" />
              <span className="text-[10px] font-bold uppercase tracking-widest">Reserved</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
