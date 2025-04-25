import { useEffect } from 'react';
import { useTodoStore } from '../stores/todo';

export function EditArea() {
  const { list, addItem, updateItem, deleteItem } = useTodoStore();

  useEffect(() => {
    useTodoStore.subscribe((state) => {
      console.log('state', state);
    });
  }, []);
  return (
    <div className="h">
      <div>列表</div>
      {list.map((item) => {
        return (
          <div key={item.id}>
            内容：{item.content}
            状态：{item.status === 'todo' ? '进行中' : '已完成'}
            <button
              onClick={() =>
                updateItem({
                  id: item.id,
                  status: item.status === 'todo' ? 'done' : 'todo',
                  content: 'new item',
                })
              }
            >
              更新
            </button>
            <button onClick={() => deleteItem(item.id)}>删除</button>
          </div>
        );
      })}

      <button onClick={() => addItem({ id: Date.now() + '', status: 'todo', content: 'new item' })}>
        增加
      </button>
    </div>
  );
}
