const context = new AudioContext();

// 创建一个振荡器
const osc = context.createOscillator();
osc.frequency.value = 220;
osc.type = 'square';
osc.start();

// 创建音节调整器
const volume = context.createGain();
volume.gain.value = 0.5;

// 创建输出
const out = context.destination;

const nodes = new Map();
nodes.set('a', osc);
nodes.set('b', volume);
nodes.set('c', out);

window.nodes = nodes;

// 看一下是否在运行
export function isRunning() {
  return context.state === 'running';
}

export function toggleAudio() {
  return context.state === 'running' ? context.suspend() : context.resume();
}

// 更新 audio的状态
export function updateAudioNode(id: string, data: Record<string, any>) {
  // 更新 map 里面 node 的属性数据
  const node = nodes.get(id);
  for (const [key, value] of Object.entries(data)) {
    // 如果是音量节点
    if (node[key] instanceof AudioParam) {
      node[key].value = value;
    } else {
      node[key] = value;
    }
  }
}

// 删除节点和关闭声音
export function removeAudioNode(id: string) {
  const node = nodes.get(id);
  node.disconnect();
  nodes.delete(id);
}

// 负责把前后两个节点连接起来，
export function connect(sourceId: string, targetId: string) {
  const source = nodes.get(sourceId);
  const target = nodes.get(targetId);
  source.connect(target);
}

// 断开连接
export function disconnect(sourceId: string, targetId: string) {
  const source = nodes.get(sourceId);
  const target = nodes.get(targetId);
  source.disconnect(target);
}

// 根据类型创建节点
export function createAudioNode(id: string, type: string, data: Record<string, any>) {
  switch (type) {
    case 'osc': {
      const node = context.createOscillator();
      node.frequency.value = data.frequency;
      node.type = data.type;
      node.start();
      nodes.set(id, node);
      break;
    }

    case 'volume': {
      const node = context.createGain();
      node.gain.value = data.gain;
      nodes.set(id, node);
      break;
    }
  }
}
