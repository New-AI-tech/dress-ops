/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProblemSolution from './components/ProblemSolution';
import Inventory from './components/Inventory';
import Features from './components/Features';
import AvailabilityShowcase from './components/AvailabilityShowcase';
import ContactForm from './components/ContactForm';
import Footer from './components/Footer';

export default function App() {
  return (
    <div className="min-h-screen bg-charcoal selection:bg-gold selection:text-charcoal">
      <Navbar />
      <main>
        <Hero />
        <ProblemSolution />
        <Inventory />
        <Features />
        <AvailabilityShowcase />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}
