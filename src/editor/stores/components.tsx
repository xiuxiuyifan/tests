import { create } from 'zustand';

// 在这里保存全局的 json
export interface Component {
  id: number;
  name: string;
  props: any;
  desc: string;
  children?: Component[];
  parentId?: number;
}

interface State {
  components: Component[];
}

interface Action {
  addComponent: (component: Component, parentId?: number) => void;
  // deleteComponent: (componentId: number) => void;
  // updateComponent: (componentId: number, props: any) => void;
}

export const useComponent = create<State & Action>((set, get) => ({
  components: [
    {
      id: 1,
      name: 'Page',
      props: {},
      desc: '页面',
    },
  ],
  addComponent: (component, parentId) =>
    set((state) => {
      if (parentId) {
        // 找到爸爸，给爸爸下面添加儿子
        const parentComponent = getComponentById(parentId, state.components);
        if (parentComponent) {
          if (parentComponent.children) {
            parentComponent.children.push(component);
          } else {
            parentComponent.children = [component];
          }
        }
        component.parentId = parentId;
        // 返回出一个新的对象
        return { components: [...state.components] };
      }
      // 直接添加到后面
      return { components: [...state.components, component] };
    }),
}));
