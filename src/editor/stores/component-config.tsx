import { create } from "zustand";
import Container from "../materials/Container";
import Button from "../materials/Button";
import Page from "../materials/Page";


export interface ComponentConfig{
    name: string
    defaultProps: Record<string, any>
    component: any
}

interface State{
    componentConfig: {
        [key: string]: ComponentConfig
    }
}

interface Action {
    registerComponent: (name: string, componentConfig:ComponentConfig) => void
}

export const useComponentConfigStore = create<State & Action>((set) => ({
    componentConfig: {
        Container: {
            name: 'Container', 
            defaultProps: {},
            component: Container
        },
        Button: {
            name: 'Button',
            defaultProps: {
                type: 'primary',
                text: '按钮'
            },
            component: Button
        },
        Page: {
            name: 'Page',
            defaultProps: {},
            component: Page
        }
    },
    // 注册组件
    registerComponent: (name, componentConfig) => set((state) => {
        return {
            ...state,
            componentConfig: {
                ...state.componentConfig,
                [name]: componentConfig
            }
        }
    })
}))


// 这里负责注册物料，json 里面的会从这里来查找对应的类型