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
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import { OscillatorNode } from './components/OscillatorNode.tsx';
import { VolumeNodes } from './components/VolumeNode.tsx';
import { OutputNode } from './components/OutputNode.tsx';

const initialNodes = [
  // dada 会被打入到 type 组件的 props 中去
  { id: '1', position: { x: 0, y: 0 }, data: { frequency: 300, type: 'square' }, type: 'osc' },
  { id: '2', position: { x: 0, y: 300 }, data: { gain: 0.6 }, type: 'volume' },
  { id: '3', position: { x: 0, y: 500 }, data: {}, type: 'out' },
];
const initialEdges = [
  { id: 'e1-1', type: 'custom', source: '1', target: '2' },
  { id: 'e1-2', type: 'custom', source: '2', target: '3' },
];

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
  const { setEdges } = useReactFlow();

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
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
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
          <button onClick={onEdgeClick}>×</button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

const nodeTypes = {
  osc: OscillatorNode,
  volume: VolumeNodes,
  out: OutputNode,
};

export default function WorkFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const handleAddNode = () => {
    setNodes([
      ...nodes,
      {
        id: Math.random().toString().split(2, 6) + '',
        type: 'red',
        position: { x: 0, y: 0 },
        data: { label: '新节点' },
      },
    ]);
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
        fitView
      >
        {/* 添加右侧面板 */}
        <Panel position="top-right">
          <button onClick={handleAddNode}>添加节点</button>
        </Panel>
        <Controls />
        <MiniMap zoomable />
        <Background variant={BackgroundVariant.Lines} />
      </ReactFlow>
    </div>
  );
}
