import { create } from 'zustand';

const useSimulationStore = create((set, get) => ({
  inputString: '',
  activeStates: [], // Array of node IDs currently active
  status: 'idle', // 'idle' | 'playing' | 'paused' | 'accepted' | 'rejected'
  currentIndex: 0, // Input string character index we are at
  speed: 1, // 0.5 to 2
  history: [], // For stepping backwards [{ activeStates, currentIndex }, ...]
  isTheoryModalOpen: localStorage.getItem('nfa_theory_hidden') !== 'true', // Start open if not hidden

  setTheoryModalOpen: (isOpen) => set({ isTheoryModalOpen: isOpen }),
  setInputString: (str) => {
    set({ inputString: str, status: 'idle', currentIndex: 0, activeStates: [], history: [] });
  },
  setSpeed: (speed) => set({ speed }),
  setStatus: (status) => set({ status }),
  setActiveStates: (states) => set({ activeStates: states }),
  setCurrentIndex: (idx) => set({ currentIndex: idx }),
  
  // Step logic
  saveHistory: () => {
    const { activeStates, currentIndex, history } = get();
    set({ history: [...history, { activeStates, currentIndex }] });
  },
  stepBack: () => {
    const { history } = get();
    if (history.length > 0) {
      const prev = history[history.length - 1];
      set({ 
        activeStates: prev.activeStates, 
        currentIndex: prev.currentIndex,
        history: history.slice(0, -1),
        status: 'paused'
      });
    }
  },
  reset: () => {
    set({ status: 'idle', currentIndex: 0, activeStates: [], history: [] });
  }
}));

export default useSimulationStore;
