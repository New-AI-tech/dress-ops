import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Plus, Trash2, RefreshCw, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../lib/supabase';
import { cn } from '@/src/lib/utils';

export type DressStatus = 'Available' | 'Rented' | 'Maintenance';

export interface Dress {
  id: string;
  name: string;
  designer: string;
  size: string;
  color: string;
  status: DressStatus;
  image_url: string;
  price?: number;
}

export default function Inventory({ isAdmin = false }: { isAdmin?: boolean }) {
  const [dresses, setDresses] = useState<Dress[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<DressStatus | 'All'>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state for new dress
  const [newDress, setNewDress] = useState<Partial<Dress>>({
    name: '',
    designer: '',
    size: '',
    color: '',
    status: 'Available',
    image_url: '',
    price: 0
  });

  useEffect(() => {
    fetchInventory();
  }, []);

  async function fetchInventory() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('dresses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDresses(data || []);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      // Fallback to empty or mock if needed for demo
    } finally {
      setLoading(false);
    }
  }

  const filteredDresses = useMemo(() => {
    return dresses.filter((dress) => {
      const matchesSearch = 
        dress.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dress.designer.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || dress.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [dresses, searchQuery, statusFilter]);

  async function updateStatus(id: string, newStatus: DressStatus) {
    try {
      const { error } = await supabase
        .from('dresses')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      setDresses(prev => prev.map(d => d.id === id ? { ...d, status: newStatus } : d));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  }

  async function deleteDress(id: string) {
    if (!confirm('Are you sure you want to remove this garment from the collection?')) return;
    try {
      const { error } = await supabase
        .from('dresses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setDresses(prev => prev.filter(d => d.id !== id));
    } catch (error) {
      console.error('Error deleting dress:', error);
    }
  }

  async function handleAddDress(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { data, error } = await supabase
        .from('dresses')
        .insert([newDress])
        .select();

      if (error) throw error;
      if (data) {
        setDresses(prev => [data[0], ...prev]);
        setShowAddModal(false);
        setNewDress({
          name: '',
          designer: '',
          size: '',
          color: '',
          status: 'Available',
          image_url: '',
          price: 0
        });
      }
    } catch (error) {
      console.error('Error adding dress:', error);
    }
  }

  if (loading && dresses.length === 0) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="w-8 h-8 text-gold animate-spin" />
        <p className="text-ivory/40 font-serif italic">Synchronizing Atelier Inventory...</p>
      </div>
    );
  }

  return (
    <section id="inventory" className="py-24 px-6 bg-charcoal relative overflow-hidden">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
            <span className="text-gold text-xs font-bold uppercase tracking-[0.3em]">
              {isAdmin ? 'Atelier Management' : 'Inventory Management'}
            </span>
            <h2 className="text-4xl md:text-6xl font-serif">
              {isAdmin ? 'Collection ' : 'The '}
              <span className="text-gradient-gold italic">{isAdmin ? 'Control' : 'Digital Showroom'}</span>
            </h2>
            <p className="text-ivory/50 max-w-xl font-light">
              {isAdmin 
                ? 'Manage your high-value inventory, update status, and add new couture pieces to the collection.'
                : 'Real-time tracking of every garment in your collection. Manage availability, monitor condition, and optimize your rental lifecycle.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {isAdmin && (
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-gold hover:bg-gold-light text-charcoal px-6 py-3 rounded-full text-xs font-bold flex items-center gap-2 uppercase tracking-widest transition-all transform hover:scale-105"
              >
                <Plus className="w-4 h-4" /> Add New Piece
              </button>
            )}
            
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ivory/40 group-focus-within:text-gold transition-colors" />
              <input
                type="text"
                placeholder="Search collection..."
                className="bg-charcoal/50 border border-ivory/10 rounded-full pl-12 pr-6 py-3 text-sm focus:border-gold outline-none transition-all w-full md:w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
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
                    src={dress.image_url || 'https://picsum.photos/seed/luxury/800/1200'}
                    alt={dress.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-transparent to-transparent opacity-60" />
                  
                  <div className="absolute top-4 right-4 flex gap-2">
                    <div className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-full border backdrop-blur-md text-[10px] font-bold uppercase tracking-widest",
                      dress.status === 'Available' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                      dress.status === 'Rented' ? 'bg-gold/10 text-gold border-gold/20' :
                      'bg-red-500/10 text-red-500 border-red-500/20'
                    )}>
                      {dress.status}
                    </div>
                    {isAdmin && (
                      <button 
                        onClick={() => deleteDress(dress.id)}
                        className="p-2 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
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
                      <p>Price</p>
                      <p className="text-ivory font-bold">AED {dress.price || 'Contact'}</p>
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

        {/* Add Dress Modal */}
        <AnimatePresence>
          {showAddModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowAddModal(false)}
                className="absolute inset-0 bg-charcoal/90 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative glass w-full max-w-2xl rounded-[3rem] p-8 md:p-12 border-gold/20 overflow-hidden"
              >
                <h3 className="text-3xl font-serif mb-8">Add New <span className="text-gold italic">Couture Piece</span></h3>
                <form onSubmit={handleAddDress} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-ivory/40 ml-4">Dress Name</label>
                      <input 
                        required
                        type="text"
                        className="w-full bg-charcoal/50 border border-ivory/10 rounded-full px-6 py-4 text-sm focus:border-gold outline-none transition-all"
                        value={newDress.name}
                        onChange={e => setNewDress({...newDress, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-ivory/40 ml-4">Designer</label>
                      <input 
                        required
                        type="text"
                        className="w-full bg-charcoal/50 border border-ivory/10 rounded-full px-6 py-4 text-sm focus:border-gold outline-none transition-all"
                        value={newDress.designer}
                        onChange={e => setNewDress({...newDress, designer: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-ivory/40 ml-4">Size</label>
                      <input 
                        required
                        type="text"
                        className="w-full bg-charcoal/50 border border-ivory/10 rounded-full px-6 py-4 text-sm focus:border-gold outline-none transition-all"
                        value={newDress.size}
                        onChange={e => setNewDress({...newDress, size: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-ivory/40 ml-4">Color</label>
                      <input 
                        required
                        type="text"
                        className="w-full bg-charcoal/50 border border-ivory/10 rounded-full px-6 py-4 text-sm focus:border-gold outline-none transition-all"
                        value={newDress.color}
                        onChange={e => setNewDress({...newDress, color: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-ivory/40 ml-4">Price (AED)</label>
                      <input 
                        required
                        type="number"
                        className="w-full bg-charcoal/50 border border-ivory/10 rounded-full px-6 py-4 text-sm focus:border-gold outline-none transition-all"
                        value={newDress.price}
                        onChange={e => setNewDress({...newDress, price: Number(e.target.value)})}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-ivory/40 ml-4">Image URL</label>
                    <div className="relative">
                      <input 
                        required
                        type="url"
                        className="w-full bg-charcoal/50 border border-ivory/10 rounded-full px-6 py-4 text-sm focus:border-gold outline-none transition-all"
                        value={newDress.image_url}
                        onChange={e => setNewDress({...newDress, image_url: e.target.value})}
                      />
                      <Upload className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-ivory/20" />
                    </div>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button 
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 px-8 py-4 rounded-full text-sm font-bold border border-ivory/10 hover:border-ivory/30 transition-all uppercase tracking-widest"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 bg-gold hover:bg-gold-light text-charcoal px-8 py-4 rounded-full text-sm font-bold transition-all transform hover:scale-105 uppercase tracking-widest"
                    >
                      Add to Collection
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
