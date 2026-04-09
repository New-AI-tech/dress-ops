import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase.ts';
import { cn } from '../lib/utils.ts';

interface Dress {
  id: string;
  name: string;
  size: string;
  price: number;
  status: string;
  image_url: string;
}

const Inventory = () => {
  const [dresses, setDresses] = useState<Dress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDresses = async () => {
      try {
        const { data, error } = await supabase
          .from('dresses')
          .select('id, name, size, price, status, image_url')
          .order('name', { ascending: true });

        if (error) throw error;
        setDresses(data || []);
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDresses();
  }, []);

  if (loading) return <div className="h-screen flex items-center justify-center bg-black text-gold-500 font-serif italic">Synchronizing Atelier Registry...</div>;

  return (
    <section className="py-24 px-6 bg-stone-950 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <header className="mb-20 space-y-4">
          <span className="text-gold text-xs font-bold uppercase tracking-[0.4em]">The Digital Showroom</span>
          <h2 className="text-5xl md:text-7xl font-serif text-white tracking-tighter">THE <span className="text-gold italic">COLLECTION</span></h2>
          <div className="h-[1px] w-40 bg-gold/30" />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          {dresses.map((dress) => (
            <div key={dress.id} className="group space-y-6">
              <div className="relative aspect-[3/4] overflow-hidden bg-stone-900 border border-stone-800">
                <img 
                  src={dress.image_url || 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=800'} 
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                  alt={dress.name}
                />
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black to-transparent translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <button className="w-full py-4 bg-gold text-black text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-white transition-colors">
                    Check Availability
                  </button>
                </div>
              </div>

              <div className="space-y-4 px-2">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-serif text-white tracking-tight">{dress.name}</h3>
                  </div>
                  <span className="text-xl font-serif text-white">AED {dress.price}</span>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-stone-900">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-bold">Size {dress.size}</span>
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      dress.status === 'Available' ? "bg-green-500" : "bg-gold"
                    )} />
                    <span className="text-[10px] uppercase tracking-[0.2em] text-stone-400 font-bold">
                      {dress.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Inventory;
