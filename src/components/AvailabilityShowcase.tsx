import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Info, RefreshCw, ChevronRight } from 'lucide-react';
import { supabase } from '../lib/supabase.ts';
import Availability from './Availability';
import { cn } from '../lib/utils.ts';

interface Dress {
  id: string;
  name: string;
  image_url: string;
  status: string;
}

export default function AvailabilityShowcase() {
  const [dresses, setDresses] = useState<Dress[]>([]);
  const [selectedDress, setSelectedDress] = useState<Dress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDresses();
  }, []);

  async function fetchDresses() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('dresses')
        .select('id, name, image_url, status')
        .eq('status', 'Available')
        .limit(6);

      if (error) throw error;
      if (data) {
        setDresses(data);
        setSelectedDress(data[0]);
      }
    } catch (error) {
      console.error('Error fetching dresses for showcase:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="w-8 h-8 text-gold animate-spin" />
        <p className="text-ivory/40 font-serif italic">Loading Atelier Schedule...</p>
      </div>
    );
  }

  return (
    <section id="calendar" className="py-24 px-6 bg-charcoal relative">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-6xl font-serif">Never Ask <span className="text-gold italic">'Is This Free?'</span> Again.</h2>
          <p className="text-ivory/50 max-w-2xl mx-auto font-light">
            Select a piece from our collection to view its live availability and reserve your fitting.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_1.5fr] gap-8">
          {/* Dress Selection */}
          <div className="space-y-4">
            <h3 className="text-xl font-serif mb-6 flex items-center gap-2">
              <span className="text-gold">01</span> Select a Garment
            </h3>
            <div className="grid gap-4">
              {dresses.map((dress) => (
                <button
                  key={dress.id}
                  onClick={() => setSelectedDress(dress)}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-2xl border transition-all text-left group",
                    selectedDress?.id === dress.id 
                      ? "glass border-gold/50 bg-gold/5" 
                      : "border-ivory/5 hover:border-ivory/20"
                  )}
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                    <img 
                      src={dress.image_url || 'https://picsum.photos/seed/luxury/200/200'} 
                      alt={dress.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-serif text-ivory truncate">{dress.name}</h4>
                  </div>
                  <ChevronRight className={cn(
                    "w-4 h-4 transition-transform",
                    selectedDress?.id === dress.id ? "text-gold translate-x-1" : "text-ivory/20 group-hover:text-ivory/40"
                  )} />
                </button>
              ))}
            </div>
          </div>

          {/* Availability Calendar */}
          <div className="space-y-4">
            <h3 className="text-xl font-serif mb-6 flex items-center gap-2">
              <span className="text-gold">02</span> Check Availability
            </h3>
            {selectedDress ? (
              <Availability dressId={selectedDress.id} />
            ) : (
              <div className="glass h-full min-h-[400px] rounded-[3rem] border-dashed border-ivory/10 flex items-center justify-center">
                <p className="text-ivory/20 font-serif italic">Select a dress to view schedule</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
