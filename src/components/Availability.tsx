import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Calendar as CalendarIcon, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface Booking {
  id: string;
  dress_id: string;
  booking_date: string;
  client_name: string;
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
        .select('booking_date')
        .eq('dress_id', dressId);
      
      if (error) throw error;
      if (data) setBookedDates(data.map(b => b.booking_date));
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
          booking_date: selectedDate,
          client_name: 'Guest Client' // In a real app, this would come from auth or a form
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
    <div className="glass p-6 rounded-3xl border-gold/10 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-5 h-5 text-gold" />
          <h4 className="text-lg font-serif">Reservation Calendar</h4>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-ivory/40">
          {new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(today)}
        </span>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
          <div key={d} className="text-center text-[10px] font-bold text-ivory/20 py-2">{d}</div>
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
                "aspect-square rounded-xl text-xs font-medium transition-all flex items-center justify-center relative group",
                isBooked || isPast 
                  ? "bg-ivory/5 text-ivory/10 cursor-not-allowed" 
                  : isSelected 
                    ? "bg-gold text-charcoal shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                    : "bg-charcoal/50 border border-ivory/5 text-ivory/60 hover:border-gold/50 hover:text-gold"
              )}
            >
              {dayNum}
              {isBooked && (
                <div className="absolute top-1 right-1 w-1 h-1 rounded-full bg-red-500/50" />
              )}
            </button>
          );
        })}
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-widest text-ivory/40">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-gold" /> Available
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-ivory/10" /> Reserved
          </div>
        </div>

        {selectedDate && (
          <button
            onClick={handleBook}
            disabled={isBooking}
            className="w-full bg-gold hover:bg-gold-light text-charcoal py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            {isBooking ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>Reserve for {new Date(selectedDate).toLocaleDateString()}</>
            )}
          </button>
        )}

        {bookingSuccess && (
          <div className="flex items-center justify-center gap-2 text-green-500 text-[10px] font-bold uppercase tracking-widest animate-bounce">
            <CheckCircle2 className="w-4 h-4" /> Reservation Confirmed
          </div>
        )}
      </div>
    </div>
  );
}
