import { useDrop } from 'react-dnd';
import { useComponentConfigStore } from '../stores/component-config';
import { useComponent } from '../stores/components';
import { message } from 'antd';

export function useMaterialDrop(accept: string[], id: number) {
  const { componentConfig } = useComponentConfigStore();
  const { components, addComponent } = useComponent();

  const [{ canDrop }, drop] = useDrop(() => ({
    accept,
    drop: (item: { type: string }, monitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        return;
      }
      // 拖拽放下的时候添加组件
      const props = componentConfig[item.type].defaultProps;
      // 根据拖拽过来的类型，添加组件到 json 里面去
      addComponent(
        {
          id: new Date().getTime(),
          name: item.type,
          props,
        },
        id,
      );
    },
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
    }),
  }));

  return {
    canDrop,
    drop
  };
}
