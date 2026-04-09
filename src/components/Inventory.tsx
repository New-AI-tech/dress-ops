import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Dress {
  id: string;
  name: string;
  designer: string;
  size: string;
  price: number;
  status: 'Available' | 'Rented' | 'Maintenance';
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
          .select('*')
          .order('created_at', { ascending: false });

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

  if (loading) return <div className="h-screen flex items-center justify-center bg-black text-gold-500">Loading Atelier...</div>;

  return (
    <section className="py-20 px-6 bg-stone-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-serif text-white mb-12 border-l-4 border-gold-500 pl-4">THE COLLECTION</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {dresses.map((dress) => (
            <div key={dress.id} className="group relative bg-black border border-stone-800 rounded-sm overflow-hidden transition-all hover:border-gold-500">
              <div className="aspect-[2/3] overflow-hidden">
                <img 
                  src={dress.image_url || 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=800'} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  alt={dress.name}
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold tracking-tighter uppercase">{dress.name}</h3>
                  <span className="text-gold-500 font-serif">AED {dress.price}</span>
                </div>
                <p className="text-stone-400 text-sm italic mb-4">{dress.designer}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase tracking-widest text-stone-500">Size {dress.size}</span>
                  <span className={`text-[10px] px-2 py-1 uppercase tracking-widest rounded-full ${
                    dress.status === 'Available' ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
                  }`}>
                    {dress.status}
                  </span>
                </div>
                <button className="w-full mt-6 py-3 border border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-black transition-colors uppercase text-xs tracking-[0.2em]">
                  Inquire Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Inventory;
