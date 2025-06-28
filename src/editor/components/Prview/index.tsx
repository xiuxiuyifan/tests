import React from 'react';
import { useComponentConfigStore } from '../../stores/component-config';
import { Component, useComponent } from '../../stores/components';

export function Preview() {
  const { components } = useComponent();
  const { componentConfig } = useComponentConfigStore();

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
        },
        renderComponents(component.children || []), // 这里的递归渲染很重要的、
      );
    });
  }

  return <div>{renderComponents(components)}</div>;
}
