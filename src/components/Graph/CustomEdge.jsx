import React from 'react';
import { BaseEdge, EdgeLabelRenderer, getBezierPath } from '@xyflow/react';
import useAutomataStore from '../../store/automataStore';

const CustomEdge = ({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  label,
  data
}) => {
  const edges = useAutomataStore(state => state.edges);

  let edgePath = '';
  let labelX = 0;
  let labelY = 0;

  if (source === target) {
    // Handling Self-Loops
    const selfLoops = edges.filter(e => e.source === source && e.target === target);
    const loopIndex = Math.max(0, selfLoops.findIndex(e => e.id === id));
    
    // Instead of using the exact Handle X/Y which might point inward/outward depending on connect,
    // we use a fixed geometric loop starting explicitly from the node's top edge.
    // Node radius is ~30px. We offset the Y heavily to make a prominent loop above.
    // Each additional loop extends further up and wider.
    
    const nodeRadius = 30;
    const baseOffsetX = 35 + (loopIndex * 15);
    const baseOffsetY = 60 + (loopIndex * 25);
    
    // We assume the true center of the node is close to (sourceX, sourceY + small offset) or we just base it off sourceX/Y
    // A clean approach is standard Cubic Bezier pointing up:
    const startX = sourceX - 10;
    const startY = sourceY - 10;
    
    const cp1X = startX - baseOffsetX;
    const cp1Y = startY - baseOffsetY;
    
    const endX = sourceX + 10;
    const endY = sourceY - 10;
    
    const cp2X = endX + baseOffsetX;
    const cp2Y = endY - baseOffsetY;

    edgePath = `M ${startX},${startY} C ${cp1X},${cp1Y} ${cp2X},${cp2Y} ${endX},${endY}`;
    
    // Position label exactly at the peak of the curve
    // For cubic bezier, t=0.5 gives the peak point:
    // With symmetric control points, X is exactly half way. Y reaches peak around control points Y.
    labelX = sourceX;
    labelY = startY - (baseOffsetY * 0.75) - 10;
    
  } else {
    // Normal edge rendering
    // Optional: Detect bidirectional edges to offset curvature (a-b & b-a)
    const reverseEdge = edges.find(e => e.source === target && e.target === source);
    
    if (reverseEdge) {
      // If a reverse edge exists, we offset the target/source slightly or use getBezierPath but maybe with tight curvature?
      // For standard React Flow, getBezierPath naturally handles the nodes reasonably well if they connect different handles.
      // We will just use it by default.
      const [path, lX, lY] = getBezierPath({
        sourceX, sourceY, sourcePosition,
        targetX, targetY, targetPosition,
      });
      edgePath = path; labelX = lX; labelY = lY;
      
      // If we wanted to drastically offset bidirectional, we'd add custom SVG here, but getBezierPath often suffices if handles differ.
    } else {
      const [path, lX, lY] = getBezierPath({
        sourceX, sourceY, sourcePosition,
        targetX, targetY, targetPosition,
      });
      edgePath = path; labelX = lX; labelY = lY;
    }
  }

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} className={data?.isActive ? 'glow-edge' : ''} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            background: 'var(--bg-panel)',
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: 12,
            fontWeight: 700,
            color: data?.isActive ? 'var(--text-main)' : 'var(--text-main)',
            border: `1px solid ${data?.isActive ? 'var(--accent-active)' : 'var(--border-color)'}`,
            pointerEvents: 'all',
            boxShadow: data?.isActive ? '0 0 12px var(--accent-active-glow)' : '0 2px 4px rgba(0,0,0,0.1)',
            zIndex: data?.isActive ? 20 : 10
          }}
          className="nodrag nopan"
        >
          {label}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default CustomEdge;
