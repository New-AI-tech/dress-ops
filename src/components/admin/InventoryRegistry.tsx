import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  History, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Trash2
} from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface Dress {
  id: string;
  internal_code: string;
  name: string;
  designer: string;
  size: string;
  color: string;
  condition_grade: string;
  location_state: string;
  base_price: number;
  image_url: string;
}

const InventoryRegistry = () => {
  const [dresses, setDresses] = useState<Dress[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchRegistry();
  }, []);

  async function fetchRegistry() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('dresses')
        .select('*')
        .order('internal_code', { ascending: true });

      if (error) throw error;
      setDresses(data || []);
    } catch (err) {
      console.error('Registry fetch error:', err);
    } finally {
      setLoading(false);
    }
  }

  const filtered = dresses.filter(d => 
    d.internal_code.toLowerCase().includes(search.toLowerCase()) ||
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.designer.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (state: string) => {
    switch (state) {
      case 'in-shop': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'cleaning': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'rented': return 'text-gold bg-gold/10 border-gold/20';
      case 'maintenance': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-stone-500 bg-stone-500/10 border-stone-500/20';
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div className="space-y-2">
          <h2 className="text-3xl font-serif text-white">Asset Registry</h2>
          <p className="text-stone-500">Forensic tracking and lifecycle management of luxury inventory.</p>
        </div>

        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-600" />
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by code, name, designer..."
              className="bg-black border border-stone-800 pl-12 pr-6 py-3 text-sm text-white focus:border-gold outline-none w-80"
            />
          </div>
          <button className="p-3 bg-stone-900 border border-stone-800 text-stone-400 hover:text-white transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="bg-stone-900/30 border border-stone-800 rounded-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-stone-800 bg-stone-900/50">
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">Asset Code</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">Garment Details</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">Physical State</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">Location State</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">Rental Value</th>
              <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-800">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center text-stone-600 font-serif italic">Synchronizing registry...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-20 text-center text-stone-600 font-serif italic">No assets found in registry.</td>
              </tr>
            ) : filtered.map((dress) => (
              <tr key={dress.id} className="hover:bg-stone-900/20 transition-colors group">
                <td className="px-6 py-4">
                  <span className="text-gold font-mono font-bold tracking-tighter">{dress.internal_code}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-16 bg-black border border-stone-800 rounded-sm overflow-hidden shrink-0">
                      <img 
                        src={dress.image_url || 'https://picsum.photos/seed/dress/200/300'} 
                        alt={dress.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white uppercase tracking-tight">{dress.name}</p>
                      <p className="text-xs text-stone-500 italic">{dress.designer}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">Size {dress.size}</span>
                    <div className="flex items-center gap-1.5">
                      <span className={cn(
                        "w-2 h-2 rounded-full",
                        dress.condition_grade === 'A' ? "bg-green-500" : 
                        dress.condition_grade === 'B' ? "bg-gold" : "bg-red-500"
                      )} />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-stone-600">Grade {dress.condition_grade}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                    getStatusColor(dress.location_state)
                  )}>
                    {dress.location_state.replace('-', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-serif text-white">AED {dress.base_price}</span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:text-gold transition-colors" title="View History">
                      <History className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:text-gold transition-colors" title="Report Damage">
                      <AlertTriangle className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:text-red-500 transition-colors" title="Retire Asset">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryRegistry;
