// async function loadExternalScript(scripts) {
//   const promises = Object.entries(scripts).map(([name, url]) => {
//     return new Promise((resolve, reject) => {
//       const script = document.createElement('script');
//       script.src = url;
//       script.onload = () => resolve();
//       script.onerror = () => reject(new Error(`Failed to load ${url}`));
//       document.head.appendChild(script);
//     });
//   });

//   return Promise.all(promises);
// }

// async function loadImportScript() {
//   await loadExternalScript({
//     Vue: 'https://cdn.jsdelivr.net/npm/vue@3.5.13/dist/vue.global.min.js',
//   });
//   await loadExternalScript({
//     ElementPlus: 'https://cdn.jsdelivr.net/npm/element-plus@2.9.7/dist/index.full.min.js',
//     dayjs: 'https://cdn.jsdelivr.net/npm/dayjs@1.11.13/dayjs.min.js',
//     antd: 'https://cdn.jsdelivr.net/npm/ant-design-vue@4.2.6/dist/antd.min.js',
//   });
//   // 这里可以安全使用 window.Vue, window.ElementPlus, window.antd
//   const libs = {
//     vue: Vue,
//   };
//   window.___magic__import__ = function (lib, name) {
//     if (Object.prototype.toString.call(libs[lib]) != '[object Module]' && name == '*') {
//       return libs[lib];
//     }
//     debugger;

//     return (libs[lib] || {})[name];
//   };
// }

// loadImportScript();

// import App from './App';

System.register(['react', 'react-dom', 'App'], function (_export) {
  'use strict';

  // 声明两个变量，类似于通过导入 umd 格式模块后，winodw.React 和 window.ReactDOM
  let React, ReactDOM, App;

  return {
    // setters 是一个注册模块回调函数的数组，与 System.register 的第一个参数里的顺序相对应
    setters: [
      function (_react) {
        /*
         * 因为我们使用的是 react 的 umd 格式的 cdn 文件，
         * 所以通过 _react.default 来获取 react 导出对象
         */
        React = _react.default;
      },
      function (_reactDom) {
        ReactDOM = _reactDom.default;
      },

      function (_App) {
        App = _App.default;
      },
    ],
    execute: function () {
      // 执行
      ReactDOM.render('Hello React', document.getElementById('root'));

      console.log(App);
      // import './index.css';

      ReactDOM.createRoot(document.getElementById('root')!).render(App);

      // 通过 _export 参数方法，我们可以导出对象，供其他 SystemJS Module 使用
      _export({
        React,
        ReactDOM,
      });
    },
  };
});
