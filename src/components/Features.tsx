import { CalendarDays, ScanSearch, UsersRound, BarChart3 } from 'lucide-react';

const features = [
  {
    title: "Visual Reservation Calendar",
    icon: CalendarDays,
    description: "Drag-and-drop dress bookings across multiple locations. See conflicts before they happen. Block out time for alterations and cleaning cycles."
  },
  {
    title: "Digital Garment Passport",
    icon: ScanSearch,
    description: "Attach high-res photos, measurement specs, condition notes, and dry-clean-only tags. Every dress has a unique QR code for instant check-in/out."
  },
  {
    title: "Client Fit & Wishlist Manager",
    icon: UsersRound,
    description: "Store client sizes, past rentals, and upcoming event dates. Get alerts when a wishlist dress becomes available in their size."
  },
  {
    title: "Availability & Utilization Analytics",
    icon: BarChart3,
    description: "Which dresses are sitting idle? Which sizes need replenishment? Maximize ROI per garment with real-time utilization reports."
  }
];

export default function Features() {
  return (
    <section id="platform" className="py-24 px-6 bg-charcoal relative">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <span className="text-gold text-xs font-bold uppercase tracking-[0.3em]">Precision Engineering</span>
          <h2 className="text-4xl md:text-6xl font-serif mt-4 max-w-3xl">
            The Precision of Haute Couture. <br />
            <span className="italic text-ivory/40">The Logic of a Supercomputer.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <div 
              key={i}
              className="group glass p-8 rounded-3xl border-ivory/5 hover:border-gold/30 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="w-12 h-12 rounded-2xl bg-gold/10 flex items-center justify-center mb-6 group-hover:bg-gold group-hover:text-charcoal transition-colors duration-500">
                <feature.icon className="w-6 h-6 text-gold group-hover:text-charcoal transition-colors duration-500" />
              </div>
              
              <h3 className="text-xl font-serif mb-4 group-hover:text-gold transition-colors">{feature.title}</h3>
              <p className="text-ivory/50 text-sm leading-relaxed font-light">
                {feature.description}
              </p>
              
              <div className="mt-8 h-[1px] w-0 group-hover:w-full bg-gold transition-all duration-700" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
