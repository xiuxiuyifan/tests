import { observer } from 'mobx-react-lite';
import { getSnapshot, types } from 'mobx-state-tree';
import { values } from 'mobx';
import React from 'react';

const Todo = types
  .model({
    name: types.optional(types.string, ''),
    done: types.optional(types.boolean, false),
  })
  .actions((self) => ({
    toggle() {
      self.done = !self.done;
    },
    setName(newName) {
      self.name = newName;
    },
  }));

const User = types.model({
  name: types.optional(types.string, ''),
});

// 创建 rootStore 模型
const RootStore = types
  .model({
    users: types.map(User),
    todos: types.optional(types.map(Todo), {}),
  })
  .actions((self) => ({
    addTodo(id, name) {
      self.todos.set(id, Todo.create({ name }));
    },
  }));

export const rootStore = RootStore.create({
  users: {},
});

export const MobxStateTreeDemo = observer((props) => (
  <div>
    <button onClick={() => props.store.addTodo(Math.random(), 'New Tack')}>Add Task</button>
    {values(props.store.todos).map((todo) => (
      <div>
        <input type="checkbox" checked={todo.done} onChange={(e) => todo.toggle()} />
        <input type="text" value={todo.name} onChange={(e) => todo.setName(e.target.value)} />
      </div>
    ))}
  </div>
));
