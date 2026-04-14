// Utility engine for NFA/DFA operations

/**
 * Gets all outgoing edges from a specific node
 * @param {string} nodeId 
 * @param {Array} edges 
 * @returns {Array} List of edges
 */
export const getOutgoingEdges = (nodeId, edges) => {
  return edges.filter(e => e.source === nodeId);
};

/**
 * Computes the epsilon closure of a set of states
 * @param {Array<string>} stateIds - Array of current state IDs
 * @param {Array} edges - Graph edges
 * @param {string} epsilonSymbol - Symbol used for epsilon transitions (default: 'ε')
 * @returns {Array<string>} - Array of state IDs in the closure
 */
export const getEpsilonClosure = (stateIds, edges, epsilonSymbol = 'ε') => {
  let closure = new Set(stateIds);
  let stack = [...stateIds];

  while (stack.length > 0) {
    const currentState = stack.pop();
    const outgoing = getOutgoingEdges(currentState, edges);
    
    outgoing.forEach(edge => {
      // Assuming edge.label contains comma-separated symbols, e.g., 'a,b,ε'
      const symbols = (edge.label || '').split(',').map(s => s.trim());
      if (symbols.includes(epsilonSymbol)) {
        if (!closure.has(edge.target)) {
          closure.add(edge.target);
          stack.push(edge.target);
        }
      }
    });
  }

  return Array.from(closure);
};

/**
 * Computes the next active states given current states and an input symbol
 * @param {Array<string>} activeStates - IDs of currently active states
 * @param {string} symbol - The input character
 * @param {Array} edges - All transitions
 * @param {string} type - 'DFA' or 'NFA'
 * @returns {Array<string>} - IDs of next active states
 */
export const computeNextStates = (activeStates, symbol, edges, type = 'DFA') => {
  let nextSet = new Set();

  activeStates.forEach(stateId => {
    const outgoing = getOutgoingEdges(stateId, edges);
    outgoing.forEach(edge => {
      const symbols = (edge.label || '').split(',').map(s => s.trim());
      if (symbols.includes(symbol)) {
        nextSet.add(edge.target);
      }
    });
  });

  let nextStates = Array.from(nextSet);

  if (type === 'NFA') {
    // Expand using epsilon closure
    nextStates = getEpsilonClosure(nextStates, edges);
  }

  return nextStates;
};

/**
 * Checks if a string is accepted instantly (used for instant validation)
 */
export const isAccepted = (str, nodes, edges, type = 'DFA') => {
  const startNode = nodes.find(n => n.data.isStart);
  if (!startNode) return false;

  let activeStates = [startNode.id];
  if (type === 'NFA') {
    activeStates = getEpsilonClosure(activeStates, edges);
  }

  for (let i = 0; i < str.length; i++) {
    const symbol = str[i];
    activeStates = computeNextStates(activeStates, symbol, edges, type);
    if (type === 'DFA' && activeStates.length === 0) {
      return false; // Dead state reached
    }
  }

  // Check if any active state is an accept state
  const acceptNodeIds = new Set(nodes.filter(n => n.data.isAccept).map(n => n.id));
  return activeStates.some(id => acceptNodeIds.has(id));
};
