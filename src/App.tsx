/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProblemSolution from './components/ProblemSolution';
import Inventory from './components/Inventory';
import Features from './components/Features';
import AvailabilityShowcase from './components/AvailabilityShowcase';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';

export default function App() {
  const [view, setView] = useState<'public' | 'admin'>('public');

  return (
    <div className="min-h-screen bg-charcoal selection:bg-gold selection:text-charcoal">
      <Navbar onAdminToggle={() => setView(prev => prev === 'public' ? 'admin' : 'public')} currentView={view} />
      <main>
        {view === 'public' ? (
          <>
            <Hero />
            <ProblemSolution />
            <Inventory isAdmin={false} />
            <Features />
            <AvailabilityShowcase />
            <ContactForm />
          </>
        ) : (
          <div className="pt-32 pb-24">
            <Inventory isAdmin={true} />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
