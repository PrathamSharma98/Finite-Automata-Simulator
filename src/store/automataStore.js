import { create } from 'zustand';
import { applyNodeChanges, applyEdgeChanges } from '@xyflow/react';

const useAutomataStore = create((set, get) => ({
  nodes: [],
  edges: [],
  type: 'DFA', // 'DFA' or 'NFA'

  setType: (type) => set({ type }),

  // React Flow handlers
  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  
  // Custom actions
  addNode: (node) => {
    set({ nodes: [...get().nodes, node] });
  },
  updateNode: (id, data) => {
    set({
      nodes: get().nodes.map(node => 
        node.id === id ? { ...node, data: { ...node.data, ...data } } : node
      )
    });
  },
  removeNode: (id) => {
    set({
      nodes: get().nodes.filter(node => node.id !== id),
      edges: get().edges.filter(edge => edge.source !== id && edge.target !== id)
    });
  },
  addEdge: (edge) => {
    set({ edges: [...get().edges, edge] });
  },
  updateEdge: (id, newEdgeData) => {
    set({
      edges: get().edges.map(edge => 
        edge.id === id ? { ...edge, ...newEdgeData } : edge
      )
    });
  },
  removeEdge: (id) => {
    set({ edges: get().edges.filter(edge => edge.id !== id) });
  },
  clearAll: () => {
    set({ nodes: [], edges: [] });
  },
  loadExample: (example) => {
    set({ nodes: example.nodes, edges: example.edges, type: example.type });
  },
  autoLayout: () => {
    const sortedNodes = [...get().nodes].sort((a, b) => a.position.x - b.position.x);
    const spacing = 180;
    const startX = 100;
    const centerY = 300;
    
    set({
      nodes: sortedNodes.map((node, index) => ({
        ...node,
        position: { x: startX + index * spacing, y: centerY }
      }))
    });
  },
  
  // Helpers
  getStartNode: () => get().nodes.find(n => n.data.isStart),
  getAcceptNodes: () => get().nodes.filter(n => n.data.isAccept),
}));

export default useAutomataStore;
