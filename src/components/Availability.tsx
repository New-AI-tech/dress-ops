import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase.ts';
import { Calendar as CalendarIcon, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils.ts';

interface Booking {
  id: string;
  dress_id: string;
  start_date: string;
  end_date: string;
  status: string;
}

export default function Availability({ dressId }: { dressId: string }) {
  const [bookedDates, setBookedDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    if (dressId) {
      fetchBookings();
    }
  }, [dressId]);

  async function fetchBookings() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('bookings')
        .select('id, dress_id, start_date, end_date, status')
        .eq('dress_id', dressId);
      
      if (error) throw error;
      if (data) {
        const dates: string[] = [];
        data.forEach(b => {
          const start = new Date(b.start_date);
          const end = new Date(b.end_date);
          const current = new Date(start);
          while (current <= end) {
            dates.push(current.toISOString().split('T')[0]);
            current.setDate(current.getDate() + 1);
          }
        });
        setBookedDates(dates);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleBook() {
    if (!selectedDate || !dressId) return;
    
    try {
      setIsBooking(true);
      const { error } = await supabase
        .from('bookings')
        .insert([{
          dress_id: dressId,
          start_date: selectedDate,
          end_date: selectedDate,
          status: 'Confirmed'
        }]);

      if (error) throw error;
      
      setBookingSuccess(true);
      setBookedDates(prev => [...prev, selectedDate]);
      setTimeout(() => setBookingSuccess(false), 3000);
    } catch (error) {
      console.error('Error creating booking:', error);
      alert('This date is no longer available. Please select another.');
      fetchBookings(); // Refresh to get latest state
    } finally {
      setIsBooking(false);
      setSelectedDate(null);
    }
  }

  // Simple calendar generation for the current month
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const date = new Date(currentYear, currentMonth, i + 1);
    return date.toISOString().split('T')[0];
  });

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center gap-2 text-ivory/40">
        <RefreshCw className="w-4 h-4 animate-spin" />
        <span className="text-xs uppercase tracking-widest">Checking Atelier Schedule...</span>
      </div>
    );
  }

  return (
    <div className="bg-black p-8 rounded-sm border border-stone-800 space-y-8">
      <div className="flex items-center justify-between border-b border-stone-800 pb-6">
        <div className="flex items-center gap-4">
          <CalendarIcon className="w-6 h-6 text-gold" />
          <h4 className="text-xl font-serif tracking-tight">Atelier Schedule</h4>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-stone-500">
          {new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(today)}
        </span>
      </div>

      <div className="grid grid-cols-7 gap-3">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
          <div key={d} className="text-center text-[10px] font-bold text-stone-600 py-2 tracking-widest">{d}</div>
        ))}
        {days.map((dateStr) => {
          const isBooked = bookedDates.includes(dateStr);
          const isSelected = selectedDate === dateStr;
          const dayNum = new Date(dateStr).getDate();
          const isPast = new Date(dateStr) < new Date(today.setHours(0,0,0,0));

          return (
            <button
              key={dateStr}
              disabled={isBooked || isPast}
              onClick={() => setSelectedDate(dateStr)}
              className={cn(
                "aspect-square rounded-sm text-xs transition-all flex items-center justify-center relative group border",
                isBooked || isPast 
                  ? "bg-stone-900/50 border-stone-800/50 text-stone-700 cursor-not-allowed" 
                  : isSelected 
                    ? "bg-gold text-black border-gold shadow-[0_0_20px_rgba(212,175,55,0.2)]"
                    : "bg-black border-stone-800 text-stone-400 hover:border-gold/50 hover:text-gold"
              )}
            >
              {dayNum}
              {isBooked && (
                <div className="absolute top-1 right-1 w-1 h-1 rounded-full bg-red-500/30" />
              )}
            </button>
          );
        })}
      </div>

      <div className="space-y-6 pt-4">
        <div className="flex flex-wrap gap-6 text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gold" /> Available
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-stone-800" /> Reserved
          </div>
        </div>

        {selectedDate && (
          <button
            onClick={handleBook}
            disabled={isBooking}
            className="w-full bg-transparent border border-gold text-gold hover:bg-gold hover:text-black py-4 rounded-sm text-xs font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3"
          >
            {isBooking ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>Confirm Reservation: {new Date(selectedDate).toLocaleDateString()}</>
            )}
          </button>
        )}

        {bookingSuccess && (
          <div className="flex items-center justify-center gap-3 text-gold text-[10px] font-bold uppercase tracking-[0.3em] animate-pulse">
            <CheckCircle2 className="w-5 h-5" /> Reservation Secured
          </div>
        )}
      </div>
    </div>
  );
}
