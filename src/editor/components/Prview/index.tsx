import React from 'react';
import { useComponentConfigStore } from '../../stores/component-config';
import { Component, useComponent } from '../../stores/components';
import { message } from 'antd';
import { GoToLinkConfig } from '../actions/GoToLink';
import { ShowMessageConfig } from '../actions/ShowMessage';

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
        // 给 props 里面 添加事件函数、
        props[event.name] = () => {
          eventConfig?.actions.forEach((action: GoToLinkConfig | ShowMessageConfig) => {
            if (action.type === 'goToLink') {
              window.location.href = action.url;
            } else if (action.type === 'showMessage') {
              if (action.config.type === 'success') {
                messageApi.success(action.config.text);
              } else if (action.config.type === 'error') {
                messageApi.error(action.config.text);
              }
            } else if (action.type === 'customJS') {
              const func = new Function('context', action.code);
              func({
                name: component.name,
                props: component.props,
                showMessage(content: string) {
                  messageApi.success(content);
                },
              });
            }
          });
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
