import React, { useState } from 'react';
import useAutomataStore from '../store/automataStore';
import useSimulationStore from '../store/simulationStore';
import { PlusCircle, PlayCircle, Settings, Trash2, FolderOpen, AlignHorizontalSpaceAround, Link as LinkIcon, BookOpen } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { MarkerType } from '@xyflow/react';
import { examples } from '../utils/preloadedExamples';

const Sidebar = () => {
  const { nodes, edges, addNode, addEdge, type, setType, clearAll, autoLayout } = useAutomataStore();
  const { setTheoryModalOpen } = useSimulationStore();
  const [transSource, setTransSource] = useState('');
  const [transSymbol, setTransSymbol] = useState('');
  const [transTarget, setTransTarget] = useState('');

  const handleAddNode = () => {
    const id = `q${nodes.length}`;
    addNode({
      id,
      position: { x: Math.random() * 200 + 50, y: Math.random() * 200 + 50 },
      data: { label: id, isStart: nodes.length === 0, isAccept: false },
      type: 'custom'
    });
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear the canvas?")) clearAll();
  };

  const handleAddTransition = () => {
    if (transSource && transTarget && transSymbol) {
      addEdge({
        id: `e-${transSource}-${transTarget}-${Date.now()}`,
        source: transSource,
        target: transTarget,
        label: transSymbol,
        type: 'custom',
        markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20, color: 'var(--border-color)' }
      });
      setTransSymbol('');
    }
  };

  return (
    <div className="sidebar" style={{ overflowY: 'auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
          <Settings size={20} /> Settings
        </h2>
        <button className="btn-icon" onClick={() => setTheoryModalOpen(true)} title="Theory & Help">
          <BookOpen size={20} style={{ color: 'var(--accent-primary)' }} />
        </button>
      </div>
      
      <div style={{ marginBottom: '24px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Automata Type</label>
        <select 
          className="input-field" 
          value={type} 
          onChange={(e) => setType(e.target.value)}
        >
          <option value="DFA">Deterministic (DFA)</option>
          <option value="NFA">Non-Deterministic (NFA)</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '24px' }}>
        <button className="btn btn-primary" onClick={handleAddNode}>
          <PlusCircle size={16} /> Add State
        </button>
        <button className="btn" onClick={autoLayout}>
          <AlignHorizontalSpaceAround size={16} /> Auto Arrange
        </button>
      </div>

      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px', marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <LinkIcon size={16} /> Add Transition
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <select className="input-field" value={transSource} onChange={e => setTransSource(e.target.value)}>
            <option value="" disabled>From State...</option>
            {nodes.map(n => <option key={n.id} value={n.id}>{n.data.label}</option>)}
          </select>
          <input 
            type="text" 
            className="input-field" 
            placeholder="Symbol (Use ε for NFA)" 
            value={transSymbol}
            onChange={e => setTransSymbol(e.target.value)}
          />
          <select className="input-field" value={transTarget} onChange={e => setTransTarget(e.target.value)}>
            <option value="" disabled>To State...</option>
            {nodes.map(n => <option key={n.id} value={n.id}>{n.data.label}</option>)}
          </select>
          <button className="btn btn-primary" onClick={handleAddTransition} disabled={!transSource || !transTarget || !transSymbol}>
            Add Transition
          </button>
        </div>
      </div>

      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FolderOpen size={16} /> Examples
        </h3>
        <select 
          className="input-field" 
          onChange={(e) => {
             const ex = examples[e.target.value];
             if (ex) useAutomataStore.getState().loadExample(ex);
          }}
          defaultValue=""
        >
          <option value="" disabled>Select an example...</option>
          {examples.map((ex, idx) => (
            <option key={idx} value={idx}>{ex.name}</option>
          ))}
        </select>
      </div>

      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '24px' }}>
        <h3 style={{ marginBottom: '16px', fontSize: '16px', color: 'var(--text-muted)' }}>Formal Definition</h3>
        <p><strong>Q:</strong> {`{${nodes.map(n => n.data.label).join(', ')}}`}</p>
        <p><strong>Σ:</strong> {'{...}'}</p>
        <p><strong>q0:</strong> {nodes.find(n => n.data.isStart)?.data.label || 'None'}</p>
        <p><strong>F:</strong> {`{${nodes.filter(n => n.data.isAccept).map(n => n.data.label).join(', ')}}`}</p>
      </div>
    </div>
  );
};

export default Sidebar;
