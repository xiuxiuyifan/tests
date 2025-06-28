import { create } from 'zustand';
import Container from '../materials/Container';
import Button from '../materials/Button';
import Page from '../materials/Page';

export interface ComponentSetter {
  name: string; // 要修改组件的 props 字段名
  label: string;
  type: string; // 对应修改的类型 input 或者 select 框类型
  [key: string]: any;
}

export interface ComponentConfig {
  name: string;
  defaultProps: Record<string, any>;
  desc: string;
  component: any;
  setter?: ComponentSetter[];
  stylesSetter?: ComponentSetter[];
}

interface State {
  componentConfig: {
    [key: string]: ComponentConfig;
  };
}

interface Action {
  registerComponent: (name: string, componentConfig: ComponentConfig) => void;
}

export const useComponentConfigStore = create<State & Action>((set) => ({
  componentConfig: {
    Container: {
      name: 'Container',
      defaultProps: {},
      desc: '容器',
      component: Container,
    },
    Button: {
      name: 'Button',
      desc: '按钮',
      defaultProps: {
        type: 'primary',
        text: '按钮',
      },
      component: Button,
      // 属性
      setter: [
        {
          name: 'type',
          label: '按钮类型',
          type: 'select',
          options: [
            { label: '主按钮', value: 'primary' },
            { label: '次按钮', value: 'default' },
          ],
        },
        {
          name: 'text',
          label: '文本',
          type: 'input',
        },
      ],
      // 样式
      stylesSetter: [
        {
          name: 'width',
          label: '宽度',
          type: 'inputNumber',
        },
        {
          name: 'height',
          label: '高度',
          type: 'inputNumber',
        },
      ],
    },
    Page: {
      name: 'Page',
      desc: '页面',
      defaultProps: {},
      component: Page,
    },
  },
  // 注册组件
  registerComponent: (name, componentConfig) =>
    set((state) => {
      return {
        ...state,
        componentConfig: {
          ...state.componentConfig,
          [name]: componentConfig,
        },
      };
    }),
}));

// 这里负责注册物料，json 里面的会从这里来查找对应的类型
