import { useEffect } from 'react';
import { useTodoStore } from '../stores/todo';
import { useComponent } from '../stores/components';

export function EditArea() {
  const { list, addItem, updateItem, deleteItem } = useTodoStore();
  const { components, addComponent, updateComponentProps } = useComponent();

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
        name: 'Video',
        desc: '视频',
        props: {},
        children: [],
      },
      222,
    );

    updateComponentProps(222, {
      title: '666666'
    })
  }, []);
  return (
    <div className="h">
      <pre>{JSON.stringify(components, null, 2)}</pre>
    </div>
  );
}
