/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Inventory from './components/Inventory';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white selection:bg-gold-500">
        <Navbar />
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/inventory" element={<Inventory />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
