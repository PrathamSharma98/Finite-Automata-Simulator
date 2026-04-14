// Pre-configured NFA/DFA examples

export const examples = [
  {
    name: "DFA: Strings ending in '01'",
    type: "DFA",
    nodes: [
      { id: "q0", position: { x: 100, y: 200 }, data: { label: "q0", isStart: true, isAccept: false }, type: "custom" },
      { id: "q1", position: { x: 300, y: 200 }, data: { label: "q1", isStart: false, isAccept: false }, type: "custom" },
      { id: "q2", position: { x: 500, y: 200 }, data: { label: "q2", isStart: false, isAccept: true }, type: "custom" }
    ],
    edges: [
      { id: "e1", source: "q0", target: "q0", label: "1", type: "custom", markerEnd: { type: "arrowclosed" } },
      { id: "e2", source: "q0", target: "q1", label: "0", type: "custom", markerEnd: { type: "arrowclosed" } },
      { id: "e3", source: "q1", target: "q1", label: "0", type: "custom", markerEnd: { type: "arrowclosed" } },
      { id: "e4", source: "q1", target: "q2", label: "1", type: "custom", markerEnd: { type: "arrowclosed" } },
      { id: "e5", source: "q2", target: "q0", label: "1", type: "custom", markerEnd: { type: "arrowclosed" } },
      { id: "e6", source: "q2", target: "q1", label: "0", type: "custom", markerEnd: { type: "arrowclosed" } }
    ]
  },
  {
    name: "NFA: Contains 'ab'",
    type: "NFA",
    nodes: [
      { id: "q0", position: { x: 100, y: 200 }, data: { label: "q0", isStart: true, isAccept: false }, type: "custom" },
      { id: "q1", position: { x: 300, y: 200 }, data: { label: "q1", isStart: false, isAccept: false }, type: "custom" },
      { id: "q2", position: { x: 500, y: 200 }, data: { label: "q2", isStart: false, isAccept: true }, type: "custom" }
    ],
    edges: [
      { id: "e1", source: "q0", target: "q0", label: "a,b", type: "custom", markerEnd: { type: "arrowclosed" } },
      { id: "e2", source: "q0", target: "q1", label: "a", type: "custom", markerEnd: { type: "arrowclosed" } },
      { id: "e3", source: "q1", target: "q2", label: "b", type: "custom", markerEnd: { type: "arrowclosed" } },
      { id: "e4", source: "q2", target: "q2", label: "a,b", type: "custom", markerEnd: { type: "arrowclosed" } }
    ]
  }
];
