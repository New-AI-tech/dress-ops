import { Calendar as CalendarIcon, Info } from 'lucide-react';

const dressAvatars = [
  { id: 1, name: "Bridal01", day: 10, status: "reserved", img: "https://picsum.photos/seed/dress1/100/100" },
  { id: 2, name: "CoutureRed", day: 12, status: "available", img: "https://picsum.photos/seed/dress2/100/100" },
  { id: 3, name: "GalaGold", day: 13, status: "available", img: "https://picsum.photos/seed/dress3/100/100" },
  { id: 4, name: "SilkNavy", day: 14, status: "available", img: "https://picsum.photos/seed/dress4/100/100" },
  { id: 5, name: "VelvetBlack", day: 22, status: "cleaning", img: "https://picsum.photos/seed/dress5/100/100" },
];

export default function AvailabilityShowcase() {
  const days = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <section id="calendar" className="py-24 px-6 bg-charcoal relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-6xl font-serif">Never Ask <span className="text-gold italic">'Is This Free?'</span> Again.</h2>
          <p className="text-ivory/50 max-w-2xl mx-auto font-light">
            See availability at a glance. Reserve with a single click. Our real-time 
            engine ensures your inventory is always where it needs to be.
          </p>
        </div>

        <div className="glass p-8 md:p-12 rounded-[3rem] border-gold/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center">
                <CalendarIcon className="w-6 h-6 text-gold" />
              </div>
              <div>
                <h3 className="text-2xl font-serif">April 2026</h3>
                <p className="text-xs text-ivory/40 uppercase tracking-widest">Live Inventory View</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-xs font-bold uppercase tracking-widest text-ivory/60">Available for Rent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gold" />
                <span className="text-xs font-bold uppercase tracking-widest text-ivory/60">Reserved (Deposit Paid)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-xs font-bold uppercase tracking-widest text-ivory/60">In Alterations / Cleaning</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-4">
            {days.map((day) => {
              const dress = dressAvatars.find(d => d.day === day);
              return (
                <div 
                  key={day}
                  className="aspect-square glass rounded-2xl border-ivory/5 p-4 flex flex-col justify-between group hover:border-gold/30 transition-all cursor-pointer relative"
                >
                  <span className="text-lg font-serif text-ivory/30 group-hover:text-gold transition-colors">{day}</span>
                  
                  {dress && (
                    <div className="relative">
                      <img 
                        src={dress.img} 
                        alt={dress.name}
                        className="w-full h-full object-cover rounded-lg opacity-80 group-hover:opacity-100 transition-opacity"
                        referrerPolicy="no-referrer"
                      />
                      <div className={`absolute -top-2 -right-2 w-4 h-4 rounded-full border-2 border-charcoal ${
                        dress.status === 'available' ? 'bg-green-500' : 
                        dress.status === 'reserved' ? 'bg-gold' : 'bg-blue-500'
                      }`} />
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-32 glass p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-gold mb-1">#{dress.name}</p>
                        <p className="text-[8px] text-ivory/60">Click to view details (Demo Interaction)</p>
                      </div>
                    </div>
                  )}

                  {!dress && day % 5 === 0 && (
                    <div className="flex justify-center">
                      <Info className="w-4 h-4 text-ivory/10 group-hover:text-gold/30" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-12 flex justify-center">
            <button 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gold hover:bg-gold-light text-charcoal px-10 py-4 rounded-full text-sm font-bold transition-all transform hover:scale-105 uppercase tracking-widest"
            >
              Request Access to Full Dashboard
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
