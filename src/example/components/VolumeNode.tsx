import { Handle, Position, useReactFlow } from '@xyflow/react';
import { ChangeEventHandler, useState } from 'react';
import { updateAudioNode } from './audio.tsx';

export interface VolumeNode {
  id: string;
  data: {
    gain: number;
  };
}

export function VolumeNodes(props) {
  const { id, data } = props;
  const { deleteElements } = useReactFlow();
  const [gain, setGain] = useState(data.gain);

  const changeGain: ChangeEventHandler<HTMLInputElement> = (e) => {
    setGain(+e.target.value);
    updateAudioNode(id, { gain: +e.target.value });
  };

  const onVolumeDelete = () => {
    deleteElements({ nodes: [{ id }] });
  };
  console.log('render');
  return (
    <div className={'rounded-md bg-white shadow-xl'}>
      <Handle type="target" className={'!w-[10px] !h-[10px]'} position={Position.Top} />
      <div>
        <p className={'rounded-t-md p-[4px] bg-blue-500 text-white'}>音量节点</p>
        <div
          className={
            'nodrag cursor-pointer absolute top-[5px] right-[5px] nopan text-center leading-[15px] text-[14px] bg-violet-50 w-[15px] h-[15px]'
          }
          onClick={onVolumeDelete}
        >
          ×
        </div>
      </div>

      <div className={'flex flex-col p-[4px]'}>
        <p>Gain</p>
        <input
          className="nodrag"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={gain}
          onChange={changeGain}
        />
        <p className={'text-right'}>{gain.toFixed(2)}</p>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
