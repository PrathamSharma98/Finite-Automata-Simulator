import React, { useEffect } from 'react';
import useSimulationStore from '../store/simulationStore';
import useAutomataStore from '../store/automataStore';
import { computeNextStates, getEpsilonClosure } from '../utils/automataEngine';
import { Play, Pause, StepForward, RotateCcw, FastForward } from 'lucide-react';

const Toolbar = () => {
  const { inputString, setInputString, status, setStatus, activeStates, setActiveStates, currentIndex, setCurrentIndex, speed, setSpeed, saveHistory, reset } = useSimulationStore();
  const { nodes, edges, type } = useAutomataStore();

  // Initialize start states when entering play state or when input changes
  useEffect(() => {
    if (status === 'idle') {
      const startNode = nodes.find(n => n.data.isStart);
      if (startNode) {
        let initialStates = [startNode.id];
        if (type === 'NFA') {
          initialStates = getEpsilonClosure(initialStates, edges);
        }
        setActiveStates(initialStates);
        setCurrentIndex(0);
      }
    }
  }, [status, inputString, nodes, edges, type, setActiveStates, setCurrentIndex]);

  // Main playback loop
  useEffect(() => {
    let timer;
    if (status === 'playing') {
      if (currentIndex < inputString.length) {
        timer = setTimeout(() => {
          handleStep();
        }, 1000 / speed);
      } else {
        // String exhausted, check acceptance
        const acceptNodes = new Set(nodes.filter(n => n.data.isAccept).map(n => n.id));
        const isAccepted = activeStates.some(id => acceptNodes.has(id));
        setStatus(isAccepted ? 'accepted' : 'rejected');
      }
    }
    return () => clearTimeout(timer);
  }, [status, currentIndex, speed, activeStates]);

  const handleStep = () => {
    if (currentIndex >= inputString.length) return;
    saveHistory();
    const symbol = inputString[currentIndex];
    const nextStates = computeNextStates(activeStates, symbol, edges, type);
    
    setActiveStates(nextStates);
    setCurrentIndex(currentIndex + 1);

    // Optional: play sound pip here
  };

  return (
    <div className="toolbar">
      <input 
        type="text" 
        className="input-field" 
        style={{ width: '250px' }} 
        placeholder="Enter input string..." 
        value={inputString}
        onChange={(e) => setInputString(e.target.value)}
        disabled={status === 'playing' || status === 'accepted' || status === 'rejected'}
      />

      <div style={{ display: 'flex', gap: '8px', borderLeft: '1px solid var(--border-color)', paddingLeft: '16px' }}>
        {status !== 'playing' ? (
          <button className="btn btn-primary" onClick={() => setStatus('playing')} disabled={!inputString || (status !== 'idle' && status !== 'paused')}>
            <Play size={16} /> Play
          </button>
        ) : (
          <button className="btn" onClick={() => setStatus('paused')}>
            <Pause size={16} /> Pause
          </button>
        )}

        <button className="btn" onClick={handleStep} disabled={status === 'playing' || status === 'accepted' || status === 'rejected' || !inputString}>
          <StepForward size={16} /> Step
        </button>

        <button className="btn" onClick={reset}>
          <RotateCcw size={16} /> Reset
        </button>
      </div>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <FastForward size={16} className="text-muted" />
        <input 
          type="range" 
          min="0.5" 
          max="3" 
          step="0.5" 
          value={speed} 
          onChange={(e) => setSpeed(parseFloat(e.target.value))}
          style={{ cursor: 'pointer' }}
        />
        <span style={{ minWidth: '40px', fontSize: '14px', color: 'var(--text-muted)' }}>{speed}x</span>
      </div>
    </div>
  );
};

export default Toolbar;
