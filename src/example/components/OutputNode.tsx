import { useState } from 'react';
import { Handle, Position } from '@xyflow/react';

export function OutputNode() {
  const [isRunning, setIsRunning] = useState(false);

  const toggleAudio = () => {
    setIsRunning((isRunning) => !isRunning);
  };

  return (
    <div className={'bg-white shadow-xl p-[20px]'}>
      <Handle type="target" position={Position.Top} />
      <div>
        <p>输出节点</p>
        <button onClick={toggleAudio}>
          {isRunning ? <span role="img">🔈</span> : <span role="img">🔇</span>}
        </button>
      </div>
    </div>
  );
}
