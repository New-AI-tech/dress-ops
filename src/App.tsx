/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Inventory from './components/Inventory';
import AvailabilityShowcase from './components/AvailabilityShowcase';
import Footer from './components/Footer';

// New Architectural Components
import AdminDashboard from './components/admin/AdminDashboard';
import DressOnboarding from './components/admin/DressOnboarding';
import InventoryRegistry from './components/admin/InventoryRegistry';
import BookingCollisionDetector from './components/staff/BookingCollisionDetector';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white selection:bg-gold-500">
        <Navbar />
        <main className="pt-20">
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/calendar" element={<AvailabilityShowcase />} />
            
            {/* Admin & Staff Mandate Routes */}
            <Route path="/admin" element={<AdminDashboard />}>
              <Route index element={<InventoryRegistry />} />
              <Route path="onboarding" element={<DressOnboarding />} />
            </Route>
            <Route path="/staff/booking" element={<BookingCollisionDetector />} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
