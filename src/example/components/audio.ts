const context = new AudioContext();

//振荡器节点产生不同波形、频率的声音
const osc = context.createOscillator();
osc.frequency.value = 220;
osc.type = 'square';
osc.start();

// Gain 节点调节音量
const volume = context.createGain();
volume.gain.value = 0.5;

// destination 节点播放声音
const out = context.destination;

osc.connect(volume);
volume.connect(out);

// 创建 第二个合成器
const osc2 = context.createOscillator();
osc2.frequency.value = 800;
osc2.type = 'sine';
osc2.start();

// 创建第二个声音调节器
const volume2 = context.createGain();
volume2.gain.value = 0.5;

osc2.connect(volume2);
volume2.connect(out);
