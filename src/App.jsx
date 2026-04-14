import React, { useEffect, useState } from 'react';
import Layout from './components/Layout';
import TheoryModal from './components/TheoryModal';

function App() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Expose toggle to window for easy access or create a floating button
  window.toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  return (
    <>
      <Layout />
      <TheoryModal />
      <button 
        style={{ position: 'fixed', bottom: 24, left: 24, zIndex: 50, padding: 8, borderRadius: '50%', background: 'var(--bg-panel)', border: '1px solid var(--border-color)', color: 'var(--text-main)', cursor: 'pointer' }}
        onClick={() => window.toggleTheme()}
        title="Toggle Theme"
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </button>
    </>
  );
}

export default App;
