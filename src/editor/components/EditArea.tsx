import React, { useEffect } from 'react';
import { useTodoStore } from '../stores/todo';
import { Component, useComponent } from '../stores/components';
import { useComponentConfig } from 'antd/es/config-provider/context';
import { useComponentConfigStore } from '../stores/component-config';

export function EditArea() {
  const { list, addItem, updateItem, deleteItem } = useTodoStore();
  const { components, addComponent, updateComponentProps } = useComponent();

  const { componentConfig } = useComponentConfigStore();

  useEffect(() => {
    useTodoStore.subscribe((state) => {
      console.log('state', state);
    });
    addComponent(
      {
        id: 222,
        name: 'Container',
        desc: '容器组件',
        props: {},
        children: [],
      },
      1,
    );
    addComponent(
      {
        id: 333,
        name: 'Button',
        desc: '按钮',
        props: {
          text: '无敌',
        },
        children: [],
      },
      222,
    );

    updateComponentProps(222, {
      title: '666666',
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
          ...config.defaultProps,
          ...component.props,
        },
        // 递归调用，渲染儿子节点
        renderComponent(component.children || []), // 有儿子的话继续渲染儿子节点
      );
    });
  }
  return (
    <div className="h">
      <pre>{JSON.stringify(components, null, 2)}</pre>
      {renderComponent(components)}
    </div>
  );
}
