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
  deleteComponent: (componentId: number) => void;
  updateComponentProps: (componentId: number, props: any) => void;
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
        // 并且把插入节点的 parentId 指向 parentID
        component.parentId = parentId;
        // 返回出一个新的对象
        return { components: [...state.components] };
      }
      // 直接添加到后面
      return { components: [...state.components, component] };
    }),
    deleteComponent: (componentId)=> {
      if(!componentId) return
      // 根据组件 id 找到当前组件实例
      const component = getComponentById(componentId, get().components)
      // 如果有父节点
      if(component.parentId) {
        const parentComponent = getComponentById(component.parentId, get().components)

        if(parentComponent) {
          parentComponent.children = parentComponent.children.filter(
            (item) => item.id !== +componentId
          )
        }
        set({components: [...get().components]})
      }
    },
    updateComponentProps: (componentId, props) => set((state) => {
      const component = getComponentById(componentId, state.components)
      if(component) {
        component.props = {
          ...component.props,
          ...props
        }
        return {
          components: [...state.components]
        }
      }
      return {components: [...state.components]}
    })
}));


export function getComponentById(id: number | null, components: Component[]) {
  if(!id) return null

  // 遍历当前的组件组件
  for(const component of components){
    if(component.id === id) return component
    // 看看有没有儿子
    if(component.children && component.children.length > 0) {
      const result = getComponentById(id, component.children)
      if(result !== null) {
        return result
      }
    }
  }
  return null
}