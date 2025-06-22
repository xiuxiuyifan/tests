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
      const config = componentConfig[item.type];
      // 根据拖拽过来的类型，添加组件到 json 里面去
      addComponent(
        {
          id: new Date().getTime(),
          name: item.type,
          desc: config.desc,
          props: config.defaultProps,
          styles: {
            background: 'pink',
          },
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
    drop,
  };
}
