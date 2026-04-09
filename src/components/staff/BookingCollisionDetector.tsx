import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Search, 
  Calendar as CalendarIcon, 
  AlertCircle, 
  CheckCircle2, 
  Clock,
  ArrowRight,
  User,
  ShieldAlert
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { format, addHours, isWithinInterval, parseISO, addDays, startOfDay } from 'date-fns';

interface Dress {
  id: string;
  internal_code: string;
  name: string;
  designer: string;
  location_state: string;
  cleaning_buffer_hours: number;
}

interface Booking {
  id: string;
  dress_id: string;
  start_date: string;
  end_date: string;
  client_name: string;
}

const BookingCollisionDetector = () => {
  const [search, setSearch] = useState('');
  const [selectedDress, setSelectedDress] = useState<Dress | null>(null);
  const [dresses, setDresses] = useState<Dress[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [clientName, setClientName] = useState('');
  
  const [collision, setCollision] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (search.length >= 2) {
      fetchDresses();
    }
  }, [search]);

  useEffect(() => {
    if (selectedDress) {
      fetchBookings(selectedDress.id);
    }
  }, [selectedDress]);

  useEffect(() => {
    checkCollision();
  }, [startDate, endDate, bookings]);

  async function fetchDresses() {
    const { data } = await supabase
      .from('dresses')
      .select('*')
      .or(`internal_code.ilike.%${search}%,name.ilike.%${search}%`)
      .limit(5);
    setDresses(data || []);
  }

  async function fetchBookings(dressId: string) {
    const { data } = await supabase
      .from('bookings')
      .select('*')
      .eq('dress_id', dressId)
      .neq('status', 'cancelled');
    setBookings(data || []);
  }

  const checkCollision = () => {
    if (!startDate || !endDate || !bookings.length) {
      setCollision(null);
      return;
    }

    const requestedStart = parseISO(startDate);
    const requestedEnd = parseISO(endDate);

    const conflict = bookings.find(b => {
      const bStart = parseISO(b.start_date);
      const bEnd = parseISO(b.end_date);
      
      // Add cleaning buffer to existing booking end
      const bBufferEnd = addHours(bEnd, selectedDress?.cleaning_buffer_hours || 48);

      return (
        isWithinInterval(requestedStart, { start: bStart, end: bBufferEnd }) ||
        isWithinInterval(requestedEnd, { start: bStart, end: bBufferEnd }) ||
        (requestedStart <= bStart && requestedEnd >= bBufferEnd)
      );
    });

    setCollision(conflict || null);
  };

  const handleCreateBooking = async () => {
    if (collision || !selectedDress || !startDate || !endDate || !clientName) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('bookings')
        .insert([{
          dress_id: selectedDress.id,
          client_name: clientName,
          start_date: startDate,
          end_date: endDate,
          status: 'confirmed'
        }]);

      if (error) throw error;
      
      alert('Reservation secured successfully.');
      window.location.reload();
    } catch (err) {
      console.error('Booking error:', err);
      alert('Failed to secure reservation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 py-10">
      <header className="space-y-2 border-b border-stone-800 pb-8">
        <h2 className="text-4xl font-serif text-white">Rental Collision Detector</h2>
        <p className="text-stone-500">Temporal constraint-satisfaction interface for staff operations.</p>
      </header>

      <div className="grid md:grid-cols-[1fr_1.5fr] gap-10">
        {/* Step 1: Asset Selection */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-gold/10 flex items-center justify-center text-[10px]">1</span>
              Identify Resource
            </h3>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-600" />
              <input 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Enter Dress Code (e.g. WD-402)"
                className="w-full bg-black border border-stone-800 pl-12 pr-4 py-4 text-white focus:border-gold outline-none rounded-sm"
              />
            </div>
            
            {dresses.length > 0 && !selectedDress && (
              <div className="bg-stone-900 border border-stone-800 rounded-sm overflow-hidden divide-y divide-stone-800">
                {dresses.map(d => (
                  <button 
                    key={d.id}
                    onClick={() => { setSelectedDress(d); setSearch(d.internal_code); setDresses([]); }}
                    className="w-full px-4 py-3 text-left hover:bg-stone-800 transition-colors flex justify-between items-center"
                  >
                    <div>
                      <p className="text-sm font-bold text-white tracking-tighter">{d.internal_code}</p>
                      <p className="text-[10px] text-stone-500 uppercase tracking-widest">{d.name}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-700" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedDress && (
            <div className="bg-stone-900/50 border border-stone-800 p-6 rounded-sm space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-2xl font-serif text-white">{selectedDress.internal_code}</p>
                  <p className="text-xs text-stone-500 italic">{selectedDress.name}</p>
                </div>
                <button 
                  onClick={() => { setSelectedDress(null); setBookings([]); setCollision(null); }}
                  className="text-[10px] font-bold uppercase tracking-widest text-stone-600 hover:text-white"
                >
                  Change
                </button>
              </div>
              <div className="pt-4 border-t border-stone-800 flex items-center gap-3">
                <div className={cn(
                  "w-2 h-2 rounded-full",
                  selectedDress.location_state === 'in-shop' ? "bg-green-500" : "bg-gold"
                )} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                  Current: {selectedDress.location_state.replace('-', ' ')}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Temporal Binding */}
        <div className="space-y-8">
          <div className="space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-gold flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-gold/10 flex items-center justify-center text-[10px]">2</span>
              Temporal Binding
            </h3>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-stone-600 uppercase tracking-widest">Pickup Date</label>
                <input 
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full bg-black border border-stone-800 px-4 py-3 text-white focus:border-gold outline-none rounded-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-stone-600 uppercase tracking-widest">Return Date</label>
                <input 
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full bg-black border border-stone-800 px-4 py-3 text-white focus:border-gold outline-none rounded-sm"
                />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-[10px] font-bold text-stone-600 uppercase tracking-widest">Client Identity</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-600" />
                  <input 
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full bg-black border border-stone-800 pl-12 pr-4 py-3 text-white focus:border-gold outline-none rounded-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Collision Visualization */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">Constraint Validation</h3>
            
            {!selectedDress ? (
              <div className="p-10 border border-dashed border-stone-800 rounded-sm flex flex-col items-center justify-center gap-3 text-stone-700">
                <ShieldAlert className="w-8 h-8 opacity-20" />
                <p className="text-xs font-serif italic">Select a resource to validate timeline</p>
              </div>
            ) : collision ? (
              <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-sm space-y-4 animate-pulse">
                <div className="flex items-center gap-3 text-red-500">
                  <AlertCircle className="w-5 h-5" />
                  <p className="text-sm font-bold uppercase tracking-widest">Collision Detected</p>
                </div>
                <div className="text-xs text-stone-400 space-y-2">
                  <p>Overlaps with existing booking for <span className="text-white font-bold">{collision.client_name}</span></p>
                  <p className="font-mono">Timeline Block: {format(parseISO(collision.start_date), 'MMM d')} → {format(parseISO(collision.end_date), 'MMM d')}</p>
                  <p className="text-[10px] text-red-500/60 uppercase font-bold tracking-tighter">Includes {selectedDress.cleaning_buffer_hours}hr Cleaning SLA</p>
                </div>
              </div>
            ) : startDate && endDate ? (
              <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-sm space-y-4">
                <div className="flex items-center gap-3 text-green-500">
                  <CheckCircle2 className="w-5 h-5" />
                  <p className="text-sm font-bold uppercase tracking-widest">Timeline Clear</p>
                </div>
                <p className="text-xs text-stone-400">No temporal conflicts detected for this period.</p>
              </div>
            ) : (
              <div className="p-10 border border-dashed border-stone-800 rounded-sm flex flex-col items-center justify-center gap-3 text-stone-700">
                <Clock className="w-8 h-8 opacity-20" />
                <p className="text-xs font-serif italic">Enter dates to check collision</p>
              </div>
            )}
          </div>

          <button 
            disabled={!selectedDress || !!collision || !startDate || !endDate || !clientName || loading}
            onClick={handleCreateBooking}
            className="w-full bg-gold disabled:bg-stone-900 disabled:text-stone-700 text-black py-4 rounded-sm text-xs font-bold uppercase tracking-[0.3em] transition-all hover:bg-gold-light"
          >
            {loading ? 'Securing Reservation...' : 'Secure Temporal Binding'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingCollisionDetector;
