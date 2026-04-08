import { ShoppingBag, Instagram, Linkedin, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal pt-24 pb-12 px-6 border-t border-ivory/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-serif font-bold tracking-tighter text-gold">
                FARYAL AL HOSARY
              </span>
              <ShoppingBag className="w-5 h-5 text-gold" />
            </div>
            <p className="text-ivory/40 text-sm font-light leading-relaxed">
              The operating system for the modern fashion rental house. 
              Precision management for high-value inventory.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center text-ivory/60 hover:text-gold hover:border-gold/30 transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center text-ivory/60 hover:text-gold hover:border-gold/30 transition-all">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full glass flex items-center justify-center text-ivory/60 hover:text-gold hover:border-gold/30 transition-all">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-gold text-xs font-bold uppercase tracking-[0.2em] mb-8">Platform</h4>
            <ul className="space-y-4">
              {['Inventory Tracking', 'Reservation Calendar', 'Client Management', 'Dry Cleaning Log'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-ivory/50 hover:text-gold text-sm transition-colors font-light">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-gold text-xs font-bold uppercase tracking-[0.2em] mb-8">Company</h4>
            <ul className="space-y-4">
              {['About', 'Security', 'Support for Stylists', 'Privacy Policy'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-ivory/50 hover:text-gold text-sm transition-colors font-light">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-gold text-xs font-bold uppercase tracking-[0.2em] mb-8">Connect</h4>
            <ul className="space-y-4">
              {['Instagram', 'LinkedIn', 'Request a Demo', 'Contact Us'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-ivory/50 hover:text-gold text-sm transition-colors font-light">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-ivory/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-ivory/30 uppercase tracking-[0.2em]">
            © {currentYear} FARYAL AL HOSARY. Every dress accounted for.
          </p>
          <div className="flex gap-8">
            <a href="#" className="text-[10px] text-ivory/30 uppercase tracking-[0.2em] hover:text-gold transition-colors">Terms of Service</a>
            <a href="#" className="text-[10px] text-ivory/30 uppercase tracking-[0.2em] hover:text-gold transition-colors">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
