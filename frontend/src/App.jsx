import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import StudioPage from './pages/StudioPage';
import HowItWorksPage from './pages/HowItWorksPage';
import AboutPage from './pages/AboutPage';

export default function App() {
  const [activePage, setActivePage] = useState('landing');

  // Sync with browser hash if present (e.g., #studio, #about)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['landing', 'studio', 'how-it-works', 'about'].includes(hash)) {
        setActivePage(hash);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handlePageChange = (page) => {
    setActivePage(page);
    window.location.hash = page;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F19] text-slate-100 selection:bg-purple-500/30 selection:text-purple-200">
      {/* Top Navigation */}
      <Navbar activePage={activePage} setActivePage={handlePageChange} />

      {/* Main Page Content */}
      <main className="flex-1 flex flex-col">
        {activePage === 'landing' && <LandingPage setActivePage={handlePageChange} />}
        {activePage === 'studio' && <StudioPage />}
        {activePage === 'how-it-works' && <HowItWorksPage setActivePage={handlePageChange} />}
        {activePage === 'about' && <AboutPage setActivePage={handlePageChange} />}
      </main>

      {/* Footer */}
      <Footer setActivePage={handlePageChange} />
    </div>
  );
}
