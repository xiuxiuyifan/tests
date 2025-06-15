import React, { useEffect, useState } from 'react';
import { useTodoStore } from '../stores/todo';
import { Component, useComponent } from '../stores/components';
import { useComponentConfig } from 'antd/es/config-provider/context';
import { useComponentConfigStore } from '../stores/component-config';
import HoverMask from './HoverMask';

export function EditArea() {
  const { list, addItem, updateItem, deleteItem } = useTodoStore();
  const { components, addComponent, updateComponentProps } = useComponent();

  const { componentConfig } = useComponentConfigStore();
  const [hoverComponentId, setHoverComponentId] = useState<number>()

  useEffect(() => {
    useTodoStore.subscribe((state) => {
      console.log('state', state);
    });
  }, []);

  function renderComponent(components: Component[]): React.ReactNode {
    return components.map((component: Component) => {
      const config = componentConfig?.[component.name];
      if (!config?.component) {
        return null;
      }
      return React.createElement(
        config.component,
        {
          key: component.id,  
          id: component.id,  // 把自己的 id 当做 props 传递到 props 里面去，方便后续，在组件内部调用 插入组件的方法、
          name: component.name,
          ...config.defaultProps,
          ...component.props,
        },
        // 递归调用，渲染儿子节点
        renderComponent(component.children || []), // 有儿子的话继续渲染儿子节点
      );
    });
  }

  const handleMouseOver = (e) => {
    const path = e.nativeEvent.composedPath()
    
    for(let i = 0 ; i < path.length; i+=1) {
      const ele = path[i] as HTMLElement
      const componentId = ele.dataset?.componentId
      if(componentId) {
        setHoverComponentId(+componentId)
        return
      }
    }
  }
  return (
    <div className="h-[100%] edit-area" onMouseOver={handleMouseOver} onMouseLeave={() => setHoverComponentId(undefined)}>
      {/* <pre>{JSON.stringify(components, null, 2)}</pre> */}
      {renderComponent(components)}
      {hoverComponentId && (
        <HoverMask 
          portalWrapperClassName='portal-wrapper'
          containerClassName='edit-area' 
          componentId={hoverComponentId}
        />
      )}
      <div className='portal-wrapper'></div>
    </div>
  );
}
