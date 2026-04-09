import { useState, useMemo } from 'react';
import { Search, Filter, MoreVertical, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

type DressStatus = 'Available' | 'Rented' | 'Maintenance';

interface Dress {
  id: string;
  name: string;
  designer: string;
  size: string;
  color: string;
  status: DressStatus;
  image: string;
}

const INITIAL_DRESSES: Dress[] = [
  {
    id: 'DR-001',
    name: 'Midnight Velvet Gala',
    designer: 'Elie Saab',
    size: 'EU 38',
    color: 'Midnight Blue',
    status: 'Available',
    image: 'https://picsum.photos/seed/dress1/400/600',
  },
  {
    id: 'DR-002',
    name: 'Silk Orchid Gown',
    designer: 'Zuhair Murad',
    size: 'EU 36',
    color: 'Soft Lavender',
    status: 'Rented',
    image: 'https://picsum.photos/seed/dress2/400/600',
  },
  {
    id: 'DR-003',
    name: 'Golden Hour Sequin',
    designer: 'Oscar de la Renta',
    size: 'EU 40',
    color: 'Champagne Gold',
    status: 'Available',
    image: 'https://picsum.photos/seed/dress3/400/600',
  },
  {
    id: 'DR-004',
    name: 'Crimson Rose Tulle',
    designer: 'Valentino',
    size: 'EU 34',
    color: 'Deep Red',
    status: 'Maintenance',
    image: 'https://picsum.photos/seed/dress4/400/600',
  },
  {
    id: 'DR-005',
    name: 'Emerald Forest Silk',
    designer: 'Gucci',
    size: 'EU 38',
    color: 'Emerald Green',
    status: 'Available',
    image: 'https://picsum.photos/seed/dress5/400/600',
  },
  {
    id: 'DR-006',
    name: 'Pearl White Bridal',
    designer: 'Vera Wang',
    size: 'EU 36',
    color: 'Ivory',
    status: 'Rented',
    image: 'https://picsum.photos/seed/dress6/400/600',
  },
];

export default function Inventory() {
  const [dresses, setDresses] = useState<Dress[]>(INITIAL_DRESSES);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<DressStatus | 'All'>('All');

  const filteredDresses = useMemo(() => {
    return dresses.filter((dress) => {
      const matchesSearch = 
        dress.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dress.designer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dress.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || dress.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [dresses, searchQuery, statusFilter]);

  const updateStatus = (id: string, newStatus: DressStatus) => {
    setDresses((prev) =>
      prev.map((dress) => (dress.id === id ? { ...dress, status: newStatus } : dress))
    );
  };

  const getStatusIcon = (status: DressStatus) => {
    switch (status) {
      case 'Available': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'Rented': return <Clock className="w-4 h-4 text-gold" />;
      case 'Maintenance': return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusStyles = (status: DressStatus) => {
    switch (status) {
      case 'Available': return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'Rented': return 'bg-gold/10 text-gold border-gold/20';
      case 'Maintenance': return 'bg-red-500/10 text-red-500 border-red-500/20';
    }
  };

  return (
    <section id="inventory" className="py-24 px-6 bg-charcoal relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <span className="text-gold text-xs font-bold uppercase tracking-[0.3em]">Inventory Management</span>
            <h2 className="text-4xl md:text-6xl font-serif">The <span className="text-gradient-gold italic">Digital Showroom</span></h2>
            <p className="text-ivory/50 max-w-xl font-light">
              Real-time tracking of every garment in your collection. Manage availability, 
              monitor condition, and optimize your rental lifecycle.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ivory/40 group-focus-within:text-gold transition-colors" />
              <input
                type="text"
                placeholder="Search by name, designer, or ID..."
                className="bg-charcoal/50 border border-ivory/10 rounded-full pl-12 pr-6 py-3 text-sm focus:border-gold outline-none transition-all w-full md:w-80"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2 bg-charcoal/50 border border-ivory/10 rounded-full px-4 py-2">
              <Filter className="w-4 h-4 text-ivory/40" />
              <select
                className="bg-transparent text-sm text-ivory/70 outline-none cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
              >
                <option value="All">All Status</option>
                <option value="Available">Available</option>
                <option value="Rented">Rented</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredDresses.map((dress) => (
              <motion.div
                layout
                key={dress.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="glass rounded-[2rem] overflow-hidden border-ivory/5 group hover:border-gold/30 transition-all duration-500"
              >
                <div className="aspect-[3/4] relative overflow-hidden">
                  <img
                    src={dress.image}
                    alt={dress.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent opacity-60" />
                  
                  <div className="absolute top-4 right-4">
                    <div className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-md text-[10px] font-bold uppercase tracking-widest",
                      getStatusStyles(dress.status)
                    )}>
                      {getStatusIcon(dress.status)}
                      {dress.status}
                    </div>
                  </div>

                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="text-gold text-[10px] font-bold uppercase tracking-[0.2em] mb-1">{dress.designer}</p>
                    <h3 className="text-2xl font-serif text-ivory">{dress.name}</h3>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div className="flex items-center justify-between text-xs uppercase tracking-widest text-ivory/40">
                    <div className="space-y-1">
                      <p>Size</p>
                      <p className="text-ivory font-bold">{dress.size}</p>
                    </div>
                    <div className="space-y-1 text-right">
                      <p>Color</p>
                      <p className="text-ivory font-bold">{dress.color}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => updateStatus(dress.id, 'Rented')}
                      disabled={dress.status === 'Rented'}
                      className={cn(
                        "py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                        dress.status === 'Rented' 
                          ? "bg-ivory/5 text-ivory/20 cursor-not-allowed"
                          : "bg-gold/10 text-gold hover:bg-gold hover:text-charcoal"
                      )}
                    >
                      Mark Rented
                    </button>
                    <button
                      onClick={() => updateStatus(dress.id, 'Maintenance')}
                      disabled={dress.status === 'Maintenance'}
                      className={cn(
                        "py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all",
                        dress.status === 'Maintenance'
                          ? "bg-ivory/5 text-ivory/20 cursor-not-allowed"
                          : "bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-ivory"
                      )}
                    >
                      Maintenance
                    </button>
                  </div>
                  
                  {dress.status !== 'Available' && (
                    <button
                      onClick={() => updateStatus(dress.id, 'Available')}
                      className="w-full py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest border border-ivory/10 hover:border-gold hover:text-gold transition-all"
                    >
                      Set to Available
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredDresses.length === 0 && (
          <div className="text-center py-24 glass rounded-[2rem] border-dashed border-ivory/10">
            <p className="text-ivory/40 font-light italic">No garments found matching your criteria.</p>
          </div>
        )}
      </div>
    </section>
  );
}
