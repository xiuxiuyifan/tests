import { Handle, Position } from '@xyflow/react';

export interface VolumeNode {
  id: string;
  data: {
    gain: number;
  };
}

export function VolumeNodes({ data }: VolumeNode) {
  return (
    <div className={'rounded-md bg-white shadow-xl'}>
      <Handle type="target" position={Position.Top} />

      <p className={'rounded-t-md p-[4px] bg-blue-500 text-white'}>音量节点</p>
      <div className={'flex flex-col p-[4px]'}>
        <p>Gain</p>
        <input type="range" min="0" max="1" step="0.01" value={data.gain} />
        <p className={'text-right'}>{data.gain.toFixed(2)}</p>
      </div>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
