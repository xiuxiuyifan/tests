import { create } from 'zustand';
import Container from '../materials/Container/dev';
import Button from '../materials/Button/prod';
import Page from '../materials/Page/dev';
import ButtonDev from '../materials/Button/dev';
import ContainerDev from '../materials/Container/dev';
import ContainerProd from '../materials/Container/prod';
import ButtonProd from '../materials/Button/prod';
import PageDev from '../materials/Page/dev';
import PageProd from '../materials/Page/prod';

export interface ComponentSetter {
  name: string; // 要修改组件的 props 字段名
  label: string;
  type: string; // 对应修改的类型 input 或者 select 框类型
  [key: string]: any;
}

// {
//   name: 'onClick',
//   label: '点击事件',
// }

export interface ComponentEvent {
  name: string;
  label: string;
}

export interface ComponentConfig {
  name: string;
  defaultProps: Record<string, any>;
  desc: string;
  setter?: ComponentSetter[]; // 组件属性
  stylesSetter?: ComponentSetter[]; // 样式属性
  dev: any; // 编辑的时候展示的组件
  prod: any; //  预览的时候展示的组件
  events?: ComponentEvent[];
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
      dev: ContainerDev,
      prod: ContainerProd,
    },
    Button: {
      name: 'Button',
      desc: '按钮',
      defaultProps: {
        type: 'primary',
        text: '按钮',
      },
      dev: ButtonDev,
      prod: ButtonProd,
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
      events: [
        {
          name: 'onClick',
          label: '点击事件',
        },
        {
          name: 'onDoubleClick',
          label: '双击事件',
        },
      ],
    },
    Page: {
      name: 'Page',
      desc: '页面',
      defaultProps: {},
      dev: PageDev,
      prod: PageProd,
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
