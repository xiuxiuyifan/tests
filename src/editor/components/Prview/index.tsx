import React from 'react';
import { useComponentConfigStore } from '../../stores/component-config';
import { Component, useComponent } from '../../stores/components';
import { message } from 'antd';

export function Preview() {
  const { components } = useComponent();
  const { componentConfig } = useComponentConfigStore();
  const [messageApi, contextHolder] = message.useMessage();

  function handleEvent(component: Component) {
    const props: Record<string, any> = {};

    componentConfig[component.name].events?.forEach((event) => {
      // 从 props 里面取出事件配置
      //    "props": {
      //         "type": "primary",
      //         "text": "按钮",
      //         "onClick": {
      //            "type": "showMessage"
      //         },
      //         "onDoubleClick": {
      //            "type": "showMessage"
      //         }
      //     },
      const eventConfig = component.props[event.name];
      if (eventConfig) {
        const { type } = eventConfig;
        // 给 props 里面 添加事件函数、
        props[event.name] = () => {
          if (type === 'goToLink' && eventConfig.url) {
            window.location.href = eventConfig.url;
          } else if (type === 'showMessage' && eventConfig.config) {
            if (eventConfig.config.type === 'success') {
              debugger;
              messageApi.success(eventConfig.config.text);
            } else if (eventConfig.config.type === 'error') {
              messageApi.error(eventConfig.config.text);
            }
          }
        };
      }
    });
    // 取出 props 里面的值
    return props;
  }
  function renderComponents(components: Component[]): React.ReactNode {
    return components.map((component: Component) => {
      const config = componentConfig?.[component.name];

      if (!config?.prod) {
        return null;
      }

      return React.createElement(
        config.prod,
        {
          key: component.id,
          id: component.id,
          name: component.name,
          styles: component.styles,
          ...config.defaultProps,
          ...component.props,
          ...handleEvent(component),
        },
        renderComponents(component.children || []), // 这里的递归渲染很重要的、
      );
    });
  }

  return (
    <div>
      {contextHolder}
      {renderComponents(components)}
    </div>
  );
}
