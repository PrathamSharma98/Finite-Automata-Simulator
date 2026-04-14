import React, { useCallback, useMemo, useState } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge as rfAddEdge,
  MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import useAutomataStore from '../../store/automataStore';
import CustomNode from './CustomNode';
import CustomEdge from './CustomEdge';

const Canvas = () => {
  const { nodes, edges, onNodesChange, onEdgesChange, addEdge } = useAutomataStore();

  const nodeTypes = useMemo(() => ({ custom: CustomNode }), []);
  const edgeTypes = useMemo(() => ({ custom: CustomEdge }), []);

  const [selectedNode, setSelectedNode] = useState(null);
  const [selectedEdge, setSelectedEdge] = useState(null);

  const onConnect = useCallback(
    (params) => {
      const symbol = window.prompt("Enter transition symbol (use 'ε' for NFA empty transition):", "a");
      if (symbol !== null) {
        addEdge({
          ...params,
          id: `e-${params.source}-${params.target}-${Date.now()}`,
          label: symbol,
          type: 'custom',
          markerEnd: { type: MarkerType.ArrowClosed, width: 20, height: 20, color: 'var(--border-color)' }
        });
      }
    },
    [addEdge]
  );

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
    setSelectedEdge(null);
  }, []);

  const onEdgeClick = useCallback((event, edge) => {
    setSelectedEdge(edge);
    setSelectedNode(null);
  }, []);

  const handleToggleAccept = () => {
    if (selectedNode) {
      useAutomataStore.getState().updateNode(selectedNode.id, { isAccept: !selectedNode.data.isAccept });
      setSelectedNode({ ...selectedNode, data: { ...selectedNode.data, isAccept: !selectedNode.data.isAccept } });
    }
  };

  const handleToggleStart = () => {
    if (selectedNode) {
      useAutomataStore.getState().nodes.forEach(n => {
         if (n.id !== selectedNode.id && n.data.isStart) {
            useAutomataStore.getState().updateNode(n.id, { isStart: false });
         }
      });
      useAutomataStore.getState().updateNode(selectedNode.id, { isStart: true });
      setSelectedNode({ ...selectedNode, data: { ...selectedNode.data, isStart: true } });
    }
  };

  const handleRemoveNode = () => {
    if (selectedNode) {
      useAutomataStore.getState().removeNode(selectedNode.id);
      setSelectedNode(null);
    }
  };

  const handleRenameNode = (newLabel) => {
    if (selectedNode) {
      useAutomataStore.getState().updateNode(selectedNode.id, { label: newLabel });
      setSelectedNode({ ...selectedNode, data: { ...selectedNode.data, label: newLabel } });
    }
  };

  const handleEdgeSymbolChange = (newSymbol) => {
    if (selectedEdge) {
      useAutomataStore.getState().updateEdge(selectedEdge.id, { label: newSymbol });
      setSelectedEdge({ ...selectedEdge, label: newSymbol });
    }
  };

  const handleRemoveEdge = () => {
    if (selectedEdge) {
      useAutomataStore.getState().removeEdge(selectedEdge.id);
      setSelectedEdge(null);
    }
  };


  return (
    <div className="canvas-container">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={() => { setSelectedNode(null); setSelectedEdge(null); }}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
      >
        <Background color="var(--border-color)" gap={16} />
        <Controls />
      </ReactFlow>

      {selectedNode && (
        <div style={{ position: 'absolute', top: 24, right: 24, background: 'var(--bg-panel)', padding: '20px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', zIndex: 10, minWidth: '250px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
          <h3 style={{ marginBottom: 16, fontSize: 16 }}>Edit Node</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
               <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Node Label</label>
               <input 
                 type="text" 
                 className="input-field" 
                 value={selectedNode.data.label} 
                 onChange={e => handleRenameNode(e.target.value)} 
               />
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input type="checkbox" checked={selectedNode.data.isStart} onChange={handleToggleStart} />
              Set as Start State
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
              <input type="checkbox" checked={selectedNode.data.isAccept} onChange={handleToggleAccept} />
              Set as Accept State
            </label>
            <button className="btn" onClick={handleRemoveNode} style={{ color: 'var(--accent-danger)', marginTop: 8, padding: '6px' }}>
              Delete State
            </button>
          </div>
        </div>
      )}

      {selectedEdge && (
        <div style={{ position: 'absolute', top: 24, right: 24, background: 'var(--bg-panel)', padding: '20px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', zIndex: 10, minWidth: '250px', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
          <h3 style={{ marginBottom: 16, fontSize: 16 }}>Edit Transition</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
               <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>Symbols (Comma separated)</label>
               <input 
                 type="text" 
                 className="input-field" 
                 value={selectedEdge.label || ''} 
                 onChange={e => handleEdgeSymbolChange(e.target.value)} 
               />
            </div>
            <button className="btn" onClick={handleRemoveEdge} style={{ color: 'var(--accent-danger)', marginTop: 8, padding: '6px' }}>
              Delete Transition
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Canvas;
