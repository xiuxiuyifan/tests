import { useEffect, useRef } from 'react';
const { createApp } = Vue;

console.log('RenderVue');
const RenderVue = (props) => {
  const { componentCode } = props;
  const vueAppRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    // 清理旧的 Vue 实例
    if (vueAppRef.current) {
      vueAppRef.current.unmount();
      containerRef.current.innerHTML = ''; // 清空容器
    }
    // 创建新的容器元素
    const newContainer = document.createElement('div');
    newContainer.id = 'preview-vue';
    containerRef.current.appendChild(newContainer);
    try {
      // 动态解析 Vue 组件
      const component = eval(componentCode);
      // 创建并挂载 Vue 实例
      vueAppRef.current = createApp(component);
      vueAppRef.current.use(ElementPlus);
      vueAppRef.current.use(antd);
      vueAppRef.current.mount(newContainer);
    } catch (error) {
      console.error('Component parsing failed:', error);
    }
    // 清理函数
    return () => {
      if (vueAppRef.current) {
        vueAppRef.current.unmount();
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }
        vueAppRef.current = null;
      }
    };
  }, [componentCode]);

  return <div ref={containerRef} />;
};

export default RenderVue;
