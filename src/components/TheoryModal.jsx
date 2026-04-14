import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSimulationStore from '../store/simulationStore';
import { BookOpen, X, Play } from 'lucide-react';

const TheoryModal = () => {
  const { isTheoryModalOpen, setTheoryModalOpen } = useSimulationStore();
  const [dontShowAgain, setDontShowAgain] = useState(localStorage.getItem('nfa_theory_hidden') === 'true');

  const handleClose = () => {
    if (dontShowAgain) {
      localStorage.setItem('nfa_theory_hidden', 'true');
    } else {
      localStorage.removeItem('nfa_theory_hidden');
    }
    setTheoryModalOpen(false);
  };

  return (
    <AnimatePresence>
      {isTheoryModalOpen && (
        <div className="modal-overlay">
          <motion.div 
            className="modal-content"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <BookOpen size={24} style={{ color: 'var(--accent-primary)' }} />
                <h2 style={{ fontSize: '22px', margin: 0 }}>Finite Automata Theory</h2>
              </div>
              <button className="btn-icon" onClick={handleClose} title="Close">
                <X size={20} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="modal-section">
                <h3>What is Finite Automata?</h3>
                <p>A Finite Automaton is a mathematical model used to recognize patterns within input strings. It operates by moving between a finite number of configured <strong>states</strong> based strictly on the current input <strong>symbol</strong>.</p>
              </div>

              <div className="modal-section" style={{ background: 'var(--bg-main)', padding: '16px', borderRadius: 'var(--radius-sm)' }}>
                <h3>Key Formal Components</h3>
                <ul className="theory-list">
                  <li><span className="keyword">Q</span> : Finite set of all states</li>
                  <li><span className="keyword">Σ</span> : Alphabet (symbols allowed in the input string)</li>
                  <li><span className="keyword">δ</span> : Transition function determining movements</li>
                  <li><span className="keyword">q0</span> : The initial isolated Start State</li>
                  <li><span className="keyword">F</span> : Set of localized Final (Accepting) States</li>
                </ul>
              </div>

              <div className="modal-section">
                <h3>Types of Automata</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="theory-card">
                    <h4>DFA</h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Deterministic Finite Automata: Every state has exactly one strict transition mapped per symbol. No branching.</p>
                  </div>
                  <div className="theory-card">
                    <h4>NFA</h4>
                    <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Non-deterministic Finite Automata: A state can have multiple (or zero) transitions for a symbol, including <em>epsilon (ε)</em> empty transitions, causing simultaneous parallel branches.</p>
                  </div>
                </div>
              </div>

              <div className="modal-section">
                <h3>How Simulation Works</h3>
                <p style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <Play size={16} style={{ color: 'var(--accent-active)', flexShrink: 0, marginTop: '2px' }} />
                  <span>The input string is processed symbol by symbol. If the automaton completes reading the string and currently stands on an <strong>accepting state</strong>, it returns <span style={{ color: 'var(--accent-success)', fontWeight: 'bold' }}>Accepted</span>. Otherwise, it is <span style={{ color: 'var(--accent-danger)', fontWeight: 'bold' }}>Rejected</span>.</span>
                </p>
              </div>
            </div>

            <div className="modal-footer">
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: 'var(--text-muted)' }}>
                <input 
                  type="checkbox" 
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                />
                Don't show this again on startup
              </label>

              <button className="btn btn-primary" onClick={handleClose}>
                Start Simulation
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default TheoryModal;
