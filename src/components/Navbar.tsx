import { useState, useEffect } from 'react';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

export default function Navbar({ onAdminToggle, currentView }: { onAdminToggle: () => void, currentView: 'public' | 'admin' }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Platform', href: '#platform' },
    { name: 'Inventory', href: '#inventory' },
    { name: 'Calendar', href: '#calendar' },
    { name: 'Pricing', href: '#pricing' },
  ];

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4',
        isScrolled ? 'glass py-3' : 'bg-transparent'
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="text-2xl font-serif font-bold tracking-tighter text-gold">
            FARYAL AL HOSARY
          </span>
          <ShoppingBag className="w-5 h-5 text-gold" />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {currentView === 'public' && navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-ivory/70 hover:text-gold transition-colors uppercase tracking-widest"
            >
              {link.name}
            </a>
          ))}
          <div className="flex items-center gap-4 ml-4">
            <button 
              onClick={onAdminToggle}
              className="text-sm font-medium text-gold hover:text-gold-light transition-colors uppercase tracking-widest border border-gold/20 px-4 py-2 rounded-full"
            >
              {currentView === 'public' ? 'Admin Portal' : 'Exit Admin'}
            </button>
            <button className="bg-gold hover:bg-gold-light text-charcoal px-6 py-2 rounded-full text-sm font-bold transition-all transform hover:scale-105 uppercase tracking-widest">
              Request Access
            </button>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-ivory"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 glass border-t border-ivory/10 p-6 md:hidden"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-lg font-medium text-ivory/70 hover:text-gold transition-colors uppercase tracking-widest"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <hr className="border-ivory/10" />
              <div className="flex flex-col gap-4">
                <button className="text-lg font-medium text-ivory/70 hover:text-gold transition-colors uppercase tracking-widest text-left">
                  Sign In
                </button>
                <button className="bg-gold text-charcoal px-6 py-3 rounded-full text-lg font-bold uppercase tracking-widest">
                  Request Access
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
