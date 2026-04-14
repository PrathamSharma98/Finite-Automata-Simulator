import React from 'react';
import useSimulationStore from '../store/simulationStore';

const ValidationPanel = () => {
  const { inputString, currentIndex, status, activeStates } = useSimulationStore();

  if (status === 'idle' && !inputString) return null;

  const currentSymbol = currentIndex < inputString.length ? inputString[currentIndex] : 'ε';
  const remaining = inputString.substring(currentIndex);
  const consumed = inputString.substring(0, currentIndex);

  return (
    <div className="status-panel">
      {(status === 'accepted' || status === 'rejected') && (
        <div className={`status-badge ${status} shake`}>
          String {status === 'accepted' ? 'Accepted' : 'Rejected'}
        </div>
      )}
      
      <div style={{ marginBottom: '12px' }}>
        <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>Input String</div>
        <div style={{ fontSize: '18px', fontWeight: 600, letterSpacing: '2px', fontFamily: 'monospace' }}>
          <span style={{ color: 'var(--accent-primary)' }}>{consumed}</span>
          {currentIndex < inputString.length && (
            <span style={{ backgroundColor: 'var(--accent-active)', color: '#fff', outline: '2px solid var(--accent-active)', display: 'inline-block' }}>{inputString[currentIndex]}</span>
          )}
          <span style={{ color: 'var(--text-muted)' }}>{inputString.substring(currentIndex + 1)}</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Reading</div>
          <div style={{ fontWeight: 600 }}>{currentSymbol}</div>
        </div>
        <div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Active States</div>
          <div style={{ fontWeight: 600 }}>{activeStates.length} state(s)</div>
        </div>
      </div>
    </div>
  );
};

export default ValidationPanel;
