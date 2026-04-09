import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronRight, 
  ChevronLeft, 
  Upload, 
  CheckCircle2, 
  AlertCircle,
  Camera,
  Tag,
  Ruler,
  Palette,
  ShieldCheck
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { cn } from '@/src/lib/utils';

const STEPS = [
  { id: 1, title: 'Identity', icon: Tag },
  { id: 2, title: 'Physical', icon: Ruler },
  { id: 3, title: 'Visuals', icon: Camera },
  { id: 4, title: 'Rules', icon: ShieldCheck },
  { id: 5, title: 'Location', icon: Palette },
];

const DressOnboarding = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    internal_code: '',
    name: '',
    category: 'Wedding',
    designer: '',
    size: '',
    color: '',
    condition_grade: 'A',
    base_price: '',
    cleaning_buffer_hours: '48',
    alteration_allowed: false,
    image_url: '',
    location_state: 'in-shop',
    notes: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
  };

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      const { error: insertError } = await supabase
        .from('dresses')
        .insert([{
          ...formData,
          base_price: parseFloat(formData.base_price),
          cleaning_buffer_hours: parseInt(formData.cleaning_buffer_hours)
        }]);

      if (insertError) throw insertError;

      setSuccess(true);
    } catch (err: any) {
      console.error('Onboarding error:', err);
      setError(err.message || 'Failed to initialize asset registry entry.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
        <div className="w-20 h-20 bg-gold/20 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-gold" />
        </div>
        <h2 className="text-3xl font-serif text-white">Asset Registry Initialized</h2>
        <p className="text-stone-500 max-w-md">
          Dress {formData.internal_code} has been successfully onboarded into the temporal database.
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-gold text-black font-bold uppercase tracking-widest text-xs rounded-sm"
        >
          Onboard Another Asset
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h2 className="text-3xl font-serif text-white">Dress Onboarding Flow</h2>
        <p className="text-stone-500">Initialize a new trackable unit with lifecycle metadata.</p>
      </header>

      {/* Progress Bar */}
      <div className="flex justify-between relative">
        <div className="absolute top-1/2 left-0 w-full h-[1px] bg-stone-800 -z-10" />
        {STEPS.map((step) => (
          <div 
            key={step.id}
            className={cn(
              "flex flex-col items-center gap-2 bg-stone-950 px-4 transition-all duration-500",
              currentStep >= step.id ? "text-gold" : "text-stone-700"
            )}
          >
            <div className={cn(
              "w-10 h-10 rounded-full border flex items-center justify-center transition-all",
              currentStep === step.id ? "border-gold bg-gold/10" : 
              currentStep > step.id ? "border-gold bg-gold" : "border-stone-800 bg-stone-900"
            )}>
              {currentStep > step.id ? (
                <CheckCircle2 className="w-5 h-5 text-black" />
              ) : (
                <step.icon className="w-5 h-5" />
              )}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest">{step.title}</span>
          </div>
        ))}
      </div>

      {/* Form Content */}
      <div className="bg-stone-900/50 border border-stone-800 rounded-sm p-10 min-h-[400px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            {currentStep === 1 && (
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Internal Code (WD-XXX)</label>
                  <input 
                    name="internal_code"
                    value={formData.internal_code}
                    onChange={handleInputChange}
                    className="w-full bg-black border border-stone-800 px-4 py-3 text-white focus:border-gold outline-none"
                    placeholder="e.g. WD-402"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Display Name</label>
                  <input 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-black border border-stone-800 px-4 py-3 text-white focus:border-gold outline-none"
                    placeholder="e.g. Ivory Mermaid Gown"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Category</label>
                  <select 
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full bg-black border border-stone-800 px-4 py-3 text-white focus:border-gold outline-none"
                  >
                    <option>Wedding</option>
                    <option>Cocktail</option>
                    <option>Modest</option>
                    <option>Evening</option>
                  </select>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Size (Numerical + Notes)</label>
                  <input 
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    className="w-full bg-black border border-stone-800 px-4 py-3 text-white focus:border-gold outline-none"
                    placeholder="e.g. 38 (Small Fit)"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Exact Color Shade</label>
                  <input 
                    name="color"
                    value={formData.color}
                    onChange={handleInputChange}
                    className="w-full bg-black border border-stone-800 px-4 py-3 text-white focus:border-gold outline-none"
                    placeholder="e.g. Champagne Ivory"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Designer / Brand</label>
                  <input 
                    name="designer"
                    value={formData.designer}
                    onChange={handleInputChange}
                    className="w-full bg-black border border-stone-800 px-4 py-3 text-white focus:border-gold outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Condition Grade</label>
                  <select 
                    name="condition_grade"
                    value={formData.condition_grade}
                    onChange={handleInputChange}
                    className="w-full bg-black border border-stone-800 px-4 py-3 text-white focus:border-gold outline-none"
                  >
                    <option value="A">Grade A (Pristine)</option>
                    <option value="B">Grade B (Minor Wear)</option>
                    <option value="C">Grade C (Damaged/Repair Needed)</option>
                  </select>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div className="border-2 border-dashed border-stone-800 rounded-sm p-12 flex flex-col items-center justify-center gap-4 hover:border-gold/30 transition-all cursor-pointer">
                  <Upload className="w-10 h-10 text-stone-600" />
                  <p className="text-stone-500 text-sm">Drag and drop forensic documentation photos</p>
                  <input 
                    type="url" 
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleInputChange}
                    placeholder="Or paste primary image URL for now"
                    className="w-full max-w-md bg-black border border-stone-800 px-4 py-3 text-white focus:border-gold outline-none text-center"
                  />
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="aspect-square bg-black border border-stone-800 rounded-sm flex items-center justify-center text-stone-700 text-[10px] uppercase font-bold">Front View</div>
                  <div className="aspect-square bg-black border border-stone-800 rounded-sm flex items-center justify-center text-stone-700 text-[10px] uppercase font-bold">Back View</div>
                  <div className="aspect-square bg-black border border-stone-800 rounded-sm flex items-center justify-center text-stone-700 text-[10px] uppercase font-bold">Detail Shot</div>
                  <div className="aspect-square bg-black border border-stone-800 rounded-sm flex items-center justify-center text-stone-700 text-[10px] uppercase font-bold">Condition</div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Base Rental Price (AED)</label>
                  <input 
                    type="number"
                    name="base_price"
                    value={formData.base_price}
                    onChange={handleInputChange}
                    className="w-full bg-black border border-stone-800 px-4 py-3 text-white focus:border-gold outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Cleaning SLA (Hours)</label>
                  <input 
                    type="number"
                    name="cleaning_buffer_hours"
                    value={formData.cleaning_buffer_hours}
                    onChange={handleInputChange}
                    className="w-full bg-black border border-stone-800 px-4 py-3 text-white focus:border-gold outline-none"
                  />
                </div>
                <div className="flex items-center gap-3 pt-4">
                  <input 
                    type="checkbox"
                    name="alteration_allowed"
                    checked={formData.alteration_allowed}
                    onChange={handleInputChange}
                    className="w-4 h-4 accent-gold"
                  />
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Alterations Allowed</label>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Initial Location State</label>
                  <select 
                    name="location_state"
                    value={formData.location_state}
                    onChange={handleInputChange}
                    className="w-full bg-black border border-stone-800 px-4 py-3 text-white focus:border-gold outline-none"
                  >
                    <option value="in-shop">In-Shop (Ready)</option>
                    <option value="cleaning">Out for Cleaning</option>
                    <option value="transit">In-Transit</option>
                    <option value="maintenance">Under Maintenance</option>
                  </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-widest">Internal Notes</label>
                  <textarea 
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full bg-black border border-stone-800 px-4 py-3 text-white focus:border-gold outline-none resize-none"
                    placeholder="Any specific handling instructions or history notes..."
                  />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center pt-6">
        <button 
          onClick={prevStep}
          disabled={currentStep === 1 || loading}
          className="flex items-center gap-2 text-stone-500 hover:text-white transition-colors disabled:opacity-0"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="text-xs font-bold uppercase tracking-widest">Back</span>
        </button>

        {error && (
          <div className="flex items-center gap-2 text-red-500 text-xs font-bold uppercase tracking-widest">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}

        {currentStep < STEPS.length ? (
          <button 
            onClick={nextStep}
            className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-gold transition-all"
          >
            Next Step
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 bg-gold text-black px-10 py-3 rounded-sm text-xs font-bold uppercase tracking-widest hover:bg-gold-light transition-all disabled:opacity-50"
          >
            {loading ? 'Initializing...' : 'Initialize Asset Registry'}
          </button>
        )}
      </div>
    </div>
  );
};

export default DressOnboarding;
