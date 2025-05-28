import { useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { toggleAudio } from './audio.tsx';

export function OutputNode() {
  const [isRunning, setIsRunning] = useState(false);

  const handleToggle = () => {
    setIsRunning((isRunning) => !isRunning);
    toggleAudio();
  };

  return (
    <div className={'bg-white shadow-xl p-[20px]'}>
      <Handle type="target" position={Position.Top} />
      <div>
        <p>输出节点</p>
        <button onClick={handleToggle}>
          {isRunning ? <span role="img">🔈</span> : <span role="img">🔇</span>}
        </button>
      </div>
    </div>
  );
}
