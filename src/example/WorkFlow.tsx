import { useCallback } from 'react';
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  Panel,
  EdgeProps,
  useReactFlow,
  getBezierPath,
  BaseEdge,
  EdgeLabelRenderer,
  Connection,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import { OscillatorNode } from './components/OscillatorNode.tsx';
import { VolumeNodes } from './components/VolumeNode.tsx';
import { OutputNode } from './components/OutputNode.tsx';
import { connect, createAudioNode, disconnect, removeAudioNode } from './components/audio.tsx';

// const initialNodes = [
//   // dada 会被打入到 type 组件的 props 中去
//   { id: '1', position: { x: 0, y: 0 }, data: { frequency: 300, type: 'square' }, type: 'osc' },
//   { id: '2', position: { x: 0, y: 300 }, data: { gain: 0.6 }, type: 'volume' },
//   { id: '3', position: { x: 0, y: 500 }, data: {}, type: 'out' },
// ];

// dada 会被打入到 type 组件的 props 中去
const initialNodes = [
  {
    id: 'a',
    position: { x: 200, y: 0 },
    data: {
      frequency: 200,
      type: 'square',
    },
    type: 'osc',
  },
  {
    id: 'b',
    type: 'volume',
    data: { gain: 0.5 },
    position: { x: 150, y: 250 },
  },
  {
    id: 'c',
    type: 'out',
    data: {},
    position: { x: 350, y: 400 },
  },
];
window.xxx = initialNodes;

const initialEdges = [];

// interface NodeProps {
//   data: {
//     label: string;
//   };
// }

//自定义节点
// function RedNode({ data }: NodeProps) {
//   return (
//     <div style={{ backgroundColor: 'red', width: '100px', height: '100px', textAlign: 'center' }}>
//       <Handle type="source" position={Position.Right} />
//       <Handle type="target" position={Position.Left} />
//       <div>{data.label}</div>
//     </div>
//   );
// }

// function BlueNode({ data }: NodeProps) {
//   return (
//     <div style={{ backgroundColor: 'blue', width: '50px', height: '50px', textAlign: 'center' }}>
//       <Handle type="source" position={Position.Bottom} />
//       <Handle type="target" position={Position.Top} />
//       <div>{data.label}</div>
//     </div>
//   );
// }

// 自定义边
function CustomEdge({
  id,
  sourceX,
  sourceY,
  sourcePosition,
  targetX,
  targetY,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const { deleteElements } = useReactFlow();

  // 计算贝塞尔曲线，绘制曲线
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // 两点之间绘制直线
  // const [edgePath, labelX, labelY] = getStraightPath({
  //   sourceX,
  //   sourceY,
  //   targetX,
  //   targetY,
  // });

  const onEdgeClick = () => {
    deleteElements({ edges: [{ id }] });
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            // EdgeLabelRenderer 里的组件默认不处理鼠标事件，如果要处理就要声明 pointerEvents: all
            pointerEvents: 'all',
          }}
        >
          <div
            className={
              'nodrag nopan text-center leading-[15px] text-[14px] bg-violet-50 w-[15px] h-[15px]'
            }
            onClick={onEdgeClick}
          >
            ×
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export default function WorkFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const nodeTypes = {
    osc: (props) => <OscillatorNode {...props} />,
    volume: (props) => <VolumeNodes {...props} />,
    out: OutputNode,
  };

  const onConnect = useCallback(
    (params: Connection) => {
      connect(params.source, params.target);
      setEdges((eds) => {
        return addEdge(
          {
            ...params,
            type: 'custom',
          },
          eds,
        );
      });
    },
    [setEdges],
  );

  const addOscNode = () => {
    // 构建新的 node 数据
    const id = Math.random().toString().slice(2, 8);
    const position = { x: 0, y: 0 };
    const type = 'osc';
    const data = { frequency: 400, type: 'sine' };

    // node 里面需要位置信息
    setNodes([...nodes, { id, type, data, position }]);
    createAudioNode(id, type, data);
  };

  const addVolumeNode = () => {
    const id = Math.random().toString().slice(2, 8);
    const position = { x: 0, y: 0 };
    const type = 'volume';
    const data = { gain: 0.5 };
    setNodes([...nodes, { id, type, data, position }]);
    createAudioNode(id, type, data);
  };

  const onNodesChangeCallback = (nodes) => {
    console.log('nodes', nodes);
    for (const { id } of nodes) {
      removeAudioNode(id);
    }
  };

  // 删除边
  const onEdgesChangeCallback = (edges) => {
    console.log('edges', edges);
    for (const item of edges) {
      const { source, target } = item;
      disconnect(source, target);
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        // 传入自定义节点类型
        nodeTypes={nodeTypes}
        // 传入自定义边
        edgeTypes={{ custom: CustomEdge }}
        onNodesDelete={onNodesChangeCallback}
        onEdgesDelete={onEdgesChangeCallback}
        fitView
      >
        {/* 添加右侧面板 */}
        <Panel position="top-right" className={'space-x-4'}>
          <button onClick={addOscNode} className={'p-[4px] rounded bg-white shadow'}>
            添加振荡器节点
          </button>
          <button onClick={addVolumeNode} className={'p-[4px] rounded bg-white shadow'}>
            添加音量节点
          </button>
        </Panel>
        <Controls />
        <MiniMap zoomable />
        <Background variant={BackgroundVariant.Lines} />
      </ReactFlow>
    </div>
  );
}

// 有几件事情是重要的
// 1. 创建节点的时候 nodes 数据需要根据最新添加的变化
// 2. 创建新节点的时候需要在 map 中创建出振荡器节点的具体实例 以便于后续进行关联
// 3. connect 的时候只需要在 map 中找到对应的 source node 和 target node 调用 connect 方法就行了
