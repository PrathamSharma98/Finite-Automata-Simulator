import React from 'react';
import { Handle, Position } from '@xyflow/react';
import useSimulationStore from '../../store/simulationStore';

const CustomNode = ({ id, data }) => {
  const activeStates = useSimulationStore(state => state.activeStates);
  const isActive = activeStates.includes(id);

  return (
    <div className={`node-custom ${data.isStart ? 'is-start' : ''} ${data.isAccept ? 'is-accept' : ''} ${isActive ? 'is-active' : ''}`}>
      {data.label}
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="target" position={Position.Bottom} style={{ opacity: 0 }} />
      {/* Invisible handles to allow connecting anywhere */}
      <Handle id="top" type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle id="bottom" type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  );
};

export default CustomNode;
