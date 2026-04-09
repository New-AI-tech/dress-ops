import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase.ts';
import { Calendar, User, Clock, CheckCircle2 } from 'lucide-react';

interface Booking {
  id: string;
  customer_name: string;
  start_date: string;
  end_date: string;
  status: string;
  dresses: {
    name: string;
  };
}

export default function StaffDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentBookings();
  }, []);

  async function fetchRecentBookings() {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          id,
          customer_name,
          start_date,
          end_date,
          status,
          dresses (name)
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      <header className="space-y-4">
        <h1 className="text-4xl md:text-6xl font-serif text-white tracking-tighter">
          STAFF <span className="text-gold italic">DASHBOARD</span>
        </h1>
        <div className="h-[1px] w-40 bg-gold/30" />
      </header>

      <div className="grid gap-8">
        <div className="bg-stone-900/50 border border-stone-800 rounded-sm p-8">
          <h2 className="text-xl font-serif text-white mb-8 flex items-center gap-3">
            <Clock className="w-5 h-5 text-gold" />
            Recent Temporal Bindings
          </h2>

          {loading ? (
            <div className="text-stone-500 font-serif italic py-12 text-center">Synchronizing Registry...</div>
          ) : bookings.length === 0 ? (
            <div className="text-stone-500 font-serif italic py-12 text-center">No active reservations found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-stone-800">
                    <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-stone-500">Garment</th>
                    <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-stone-500">Client</th>
                    <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-stone-500">Timeline</th>
                    <th className="pb-4 text-[10px] font-bold uppercase tracking-widest text-stone-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/50">
                  {bookings.map((booking) => (
                    <tr key={booking.id} className="group hover:bg-white/5 transition-colors">
                      <td className="py-6">
                        <p className="text-sm font-bold text-white tracking-tight">{booking.dresses?.name}</p>
                      </td>
                      <td className="py-6">
                        <div className="flex items-center gap-2 text-stone-400">
                          <User className="w-3 h-3" />
                          <span className="text-xs">{booking.customer_name}</span>
                        </div>
                      </td>
                      <td className="py-6">
                        <div className="flex items-center gap-2 text-stone-400">
                          <Calendar className="w-3 h-3" />
                          <span className="text-xs font-mono">
                            {new Date(booking.start_date).toLocaleDateString()} → {new Date(booking.end_date).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="py-6">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-green-500" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-stone-300">
                            {booking.status}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
