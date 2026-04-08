import { useState, FormEvent } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

export default function ContactForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    managerName: '',
    email: '',
    dressCount: '<50',
    painPoint: ''
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Simulate API call
    localStorage.setItem('faryal_lead', JSON.stringify({ ...formData, timestamp: new Date().toISOString() }));
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <section id="contact" className="py-24 px-6 bg-charcoal flex items-center justify-center min-h-[600px]">
        <div className="glass p-12 rounded-[3rem] border-gold/20 text-center max-w-xl w-full space-y-6">
          <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-gold" />
          </div>
          <h2 className="text-4xl font-serif">Thank You.</h2>
          <p className="text-ivory/60 font-light">
            Your request for priority access has been received. You are now on the list for early access. 
            Our team will reach out to you shortly.
          </p>
          <button 
            onClick={() => setIsSubmitted(false)}
            className="text-gold text-sm font-bold uppercase tracking-widest hover:underline"
          >
            Submit another request
          </button>
        </div>
      </section>
    );
  }

  return (
    <section id="contact" className="py-24 px-6 relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://picsum.photos/seed/luxury-closet/1920/1080?blur=10" 
          alt="Luxury Closet"
          className="w-full h-full object-cover opacity-20"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-charcoal/80" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <span className="text-gold text-xs font-bold uppercase tracking-[0.3em]">Join the Waitlist</span>
            <h2 className="text-5xl md:text-7xl font-serif leading-tight">
              Unlock Your <br />
              <span className="text-gradient-gold italic">Digital Showroom.</span>
            </h2>
            <p className="text-ivory/60 text-lg font-light max-w-md">
              Join the waitlist for early access. We are onboarding a select group of stylists and ateliers this season.
            </p>
            
            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-gold/60">
              <div className="w-12 h-[1px] bg-gold/30" />
              Limited slots available for Q2 2026
            </div>
          </div>

          <div className="glass p-8 md:p-12 rounded-[3rem] border-ivory/10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-ivory/40 ml-4">Business Name</label>
                  <input 
                    required
                    type="text"
                    placeholder="Atelier de Couture"
                    className="w-full bg-charcoal/50 border border-ivory/10 rounded-full px-6 py-4 text-sm focus:border-gold outline-none transition-all"
                    value={formData.businessName}
                    onChange={e => setFormData({...formData, businessName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-ivory/40 ml-4">Manager Name</label>
                  <input 
                    required
                    type="text"
                    placeholder="Jane Doe"
                    className="w-full bg-charcoal/50 border border-ivory/10 rounded-full px-6 py-4 text-sm focus:border-gold outline-none transition-all"
                    value={formData.managerName}
                    onChange={e => setFormData({...formData, managerName: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-ivory/40 ml-4">Business Email</label>
                <input 
                  required
                  type="email"
                  placeholder="jane@atelier.com"
                  className="w-full bg-charcoal/50 border border-ivory/10 rounded-full px-6 py-4 text-sm focus:border-gold outline-none transition-all"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-ivory/40 ml-4">Number of Dresses</label>
                <select 
                  className="w-full bg-charcoal/50 border border-ivory/10 rounded-full px-6 py-4 text-sm focus:border-gold outline-none transition-all appearance-none"
                  value={formData.dressCount}
                  onChange={e => setFormData({...formData, dressCount: e.target.value})}
                >
                  <option value="<50">&lt;50 Dresses</option>
                  <option value="50-200">50-200 Dresses</option>
                  <option value="200-500">200-500 Dresses</option>
                  <option value="500+">500+ Dresses</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-ivory/40 ml-4">Hardest part about tracking?</label>
                <textarea 
                  placeholder="e.g. Double bookings, cleaning status..."
                  className="w-full bg-charcoal/50 border border-ivory/10 rounded-3xl px-6 py-4 text-sm focus:border-gold outline-none transition-all min-h-[100px] resize-none"
                  value={formData.painPoint}
                  onChange={e => setFormData({...formData, painPoint: e.target.value})}
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-gold hover:bg-gold-light text-charcoal py-5 rounded-full text-sm font-bold transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2 uppercase tracking-widest mt-4"
              >
                Request Priority Access
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
