export const importMap = {
  imports: {
    vue: 'https://cdn.jsdelivr.net/npm/@vue/runtime-dom@latest/dist/runtime-dom.esm-browser.js',
    'element-plus': 'https://cdn.jsdelivr.net/npm/element-plus@latest/dist/index.full.min.mjs',
  },
};

// // 可以同时加载多个模块
// const loadModules = async () => {
//   try {
//     const [lodash, dayjs] = await Promise.all([
//       import('https://cdn.jsdelivr.net/npm/element-plus@latest/dist/index.full.min.mjs'),
//       import('https://cdn.jsdelivr.net/npm/dayjs@1.11.10/+esm'),
//     ]);

//     console.log('所有模块加载完成');
//   } catch (err) {
//     console.error('加载出错:', err);
//   }
// };

// loadModules();

// 创建 importmap 脚本元素
const importMapScript = document.createElement('script');
importMapScript.type = 'importmap';
importMapScript.textContent = JSON.stringify(importMap);
document.head.appendChild(importMapScript);

// import { createApp } from 'vue';
// import * as elementplus from 'element-plus';

// console.log(createApp);
