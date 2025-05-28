import { Handle, Position, useNodes, useReactFlow } from '@xyflow/react';
import { ChangeEventHandler, useState } from 'react';
import { updateAudioNode } from './audio.tsx';

export interface OscillatorNode {
  id: string;
  data: {
    frequency: number;
    type: string;
  };
}

export function OscillatorNode(props) {
  const { id, data } = props;
  const { deleteElements } = useReactFlow();
  // 接受父组件传递过来的 数据，并且在自己组件里面创建 state
  const [frequency, setFrequency] = useState(data.frequency);
  const [type, setType] = useState(data.type);
  const nodes = useNodes();
  console.log('nodes', nodes);
  const changeFrequency: ChangeEventHandler<HTMLInputElement> = (e) => {
    // 更新节点里面的值
    setFrequency(+e.target.value);
    updateAudioNode(id, { frequency: +e.target.value });
  };

  const changeType: ChangeEventHandler<HTMLSelectElement> = (e) => {
    setType(e.target.value);
    updateAudioNode(id, { type: e.target.value });
  };

  const onOscDelete = () => {
    deleteElements({
      nodes: [{ id }],
    });
  };

  return (
    <div className="bg-white shadow-xl">
      <div>
        <p className={'rounded-t-md p-[8px] bg-pink-500 text-white'}>振荡器节点</p>
        <div
          className={
            'nodrag cursor-pointer absolute top-[5px] right-[5px] nopan text-center leading-[15px] text-[14px] bg-violet-50 w-[15px] h-[15px]'
          }
          onClick={onOscDelete}
        >
          ×
        </div>
      </div>
      <div className={'flex flex-col p-[8px]'}>
        <span>频率</span>
        <input
          className="nodrag"
          type="range"
          min={10}
          max={1000}
          value={frequency}
          onChange={changeFrequency}
        />
        <span className={'text-right'}>{frequency}赫兹</span>
      </div>
      <hr className={'mx-[4px]'} />
      <div className={'flex flex-col p-[8px]'}>
        <p>波形</p>
        <select value={type} onChange={changeType}>
          <option value="sine">正弦波</option>
          <option value="triangle">三角波</option>
          <option value="sawtooth">锯齿波</option>
          <option value="square">方波</option>
        </select>
      </div>
      <Handle type={'source'} position={Position.Bottom} />
    </div>
  );
}
