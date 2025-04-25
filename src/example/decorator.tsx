import React from 'react';

// @testable
// class MyTestableClass {
//   // ...
// }
//
// function testable(target) {
//   target.isTestable = true;
// }
//
// MyTestableClass.isTestable; // true

// 也就是说装饰器是一个对类进行处理的函数，装饰器的第一个参数是就是所要装饰的目标类
// 无非就是在类里 自动调用注入的函数，和传入的参数而已

// function FormItem(config: {
//   type: string;
//   shouldComponentUpdate?: (prevProps: any, nextProps: any) => boolean;
// }) {
//   return function (Component: React.ComponentClass) {
//     return class a extends Component {
//       // 注入 shouldComponentUpdate 方法
//       shouldComponentUpdate(nextProps: any, nextState: any) {
//         if (config.shouldComponentUpdate) {
//           return config.shouldComponentUpdate(this.props, nextProps);
//         }
//         return super.shouldComponentUpdate?.(nextProps, nextState) ?? true;
//       }
//
//       render() {
//         return <div>hiihi</div>;
//       }
//     };
//   };
// }
//
// @FormItem({
//   type: 'input-amount',
//   shouldComponentUpdate: (prevProps, nextProps) => {
//     // 自定义比较逻辑：仅当特定 props 或 state 变化时重新渲染
//     return false;
//   },
// })
export class InputAmount extends React.Component {
  state = { count: 0 };

  render() {
    return (
      <div>
        InputAmount {this.state.count}
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>添加了</button>
      </div>
    );
  }
}
