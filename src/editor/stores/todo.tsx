import { create, StateCreator } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ListItem {
  id: string;
  status: 'todo' | 'done';
  content: string;
}

type State = {
  list: ListItem[];
};
type Action = {
  addItem: (item: ListItem) => void;
  deleteItem: (id: string) => void;
  updateItem: (item: ListItem) => void;
};

const creator: StateCreator<State & Action> = (set) => ({
  list: [],
  addItem: (item: ListItem) => {
    set((state) => {
      const newList = [...state.list];
      const index = state.list.findIndex((i) => i.id === item.id);
      if (index == -1) {
        newList.push(item);
      }
      return { list: newList };
    });
  },
  deleteItem: (id: string) => {
    set((state) => {
      const newList = state.list.filter((i) => i.id !== id);
      return { list: newList };
    });
  },
  updateItem: (item: ListItem) => {
    set((state) => {
      const newList = state.list.map((i) => {
        if (i.id === item.id) {
          return item;
        }
        return i;
      });
      return { list: newList };
    });
  },
});

export const useTodoStore = create<State & Action>()(persist(creator, { name: 'todo' }));
