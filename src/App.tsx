// import './compilerVue';
import WorkFlow from './example/WorkFlow';
// import { useState } from 'react';

// import RenderVue from './RenderVue';
//
// import ClosureComp from './example/closure';
import LowcodeEditor from './editor';
import TestMobxStateTree from './example/components/test-mobx-state-tree';
import { MobxStateTreeDemo, rootStore } from './example/components/test-mobx-state-tree1';
// import { InputAmount } from './example/decorator';

function App() {
  // const [showVue, setShowVue] = useState(false);

  //   const [count, setCount] = useState(0);
  //   const componentCode = `(function(){/* Analyzed bindings: {
  //   "reactive": "setup-const",
  //   "formState": "setup-reactive-const",
  //   "onFinish": "setup-const",
  //   "onFinishFailed": "setup-const"
  // } */
  // const _defineComponent = ___magic__import__('vue', 'defineComponent');
  // const _resolveComponent = ___magic__import__('vue', 'resolveComponent');
  // const _createVNode = ___magic__import__('vue', 'createVNode');
  // const _withCtx = ___magic__import__('vue', 'withCtx');
  // const _createTextVNode = ___magic__import__('vue', 'createTextVNode');
  // const _openBlock = ___magic__import__('vue', 'openBlock');
  // const _createBlock = ___magic__import__('vue', 'createBlock');
  //
  // const reactive = ___magic__import__('vue', 'reactive');
  //
  // const __sfc__ = _defineComponent({
  //   __name: '6df75e582af00b5dc82508cb571ced8e',
  //   setup(__props) {
  //
  // const formState = reactive({
  //   username: '',
  //   password: '',
  //   remember: true,
  // });
  // const onFinish = (values) => {
  //   console.log('Success:', values);
  // };
  //
  // const onFinishFailed = (errorInfo) => {
  //   console.log('Failed:', errorInfo);
  // };
  //
  // return (_ctx,_cache) => {
  //   const _component_a_input = _resolveComponent("a-input")
  //   const _component_a_form_item = _resolveComponent("a-form-item")
  //   const _component_a_input_password = _resolveComponent("a-input-password")
  //   const _component_a_checkbox = _resolveComponent("a-checkbox")
  //   const _component_a_button = _resolveComponent("a-button")
  //   const _component_a_form = _resolveComponent("a-form")
  //
  //   return (_openBlock(), _createBlock(_component_a_form, {
  //     model: formState,
  //     name: "basic",
  //     "label-col": { span: 8 },
  //     "wrapper-col": { span: 16 },
  //     autocomplete: "off",
  //     onFinish: onFinish,
  //     onFinishFailed: onFinishFailed
  //   }, {
  //     default: _withCtx(() => [
  //       _createVNode(_component_a_form_item, {
  //         label: "Username",
  //         name: "username",
  //         rules: [{ required: true, message: 'Please input your username!' }]
  //       }, {
  //         default: _withCtx(() => [
  //           _createVNode(_component_a_input, {
  //             value: formState.username,
  //             "onUpdate:value": _cache[0] || (_cache[0] = ($event) => ((formState.username) = $event))
  //           }, null, 8 /* PROPS */, ["value"])
  //         ]),
  //         _: 1 /* STABLE */
  //       }),
  //       _createVNode(_component_a_form_item, {
  //         label: "Password",
  //         name: "password",
  //         rules: [{ required: true, message: 'Please input your password!' }]
  //       }, {
  //         default: _withCtx(() => [
  //           _createVNode(_component_a_input_password, {
  //             value: formState.password,
  //             "onUpdate:value": _cache[1] || (_cache[1] = ($event) => ((formState.password) = $event))
  //           }, null, 8 /* PROPS */, ["value"])
  //         ]),
  //         _: 1 /* STABLE */
  //       }),
  //       _createVNode(_component_a_form_item, {
  //         name: "remember",
  //         "wrapper-col": { offset: 8, span: 16 }
  //       }, {
  //         default: _withCtx(() => [
  //           _createVNode(_component_a_checkbox, {
  //             checked: formState.remember,
  //             "onUpdate:checked": _cache[2] || (_cache[2] = ($event) => ((formState.remember) = $event))
  //           }, {
  //             default: _withCtx(() => _cache[3] || (_cache[3] = [
  //               _createTextVNode("Remember me")
  //             ])),
  //             _: 1 /* STABLE */
  //           }, 8 /* PROPS */, ["checked"])
  //         ]),
  //         _: 1 /* STABLE */
  //       }),
  //       _createVNode(_component_a_form_item, { "wrapper-col": { offset: 8, span: 16 } }, {
  //         default: _withCtx(() => [
  //           _createVNode(_component_a_button, {
  //             type: "primary",
  //             "html-type": "submit"
  //           }, {
  //             default: _withCtx(() => _cache[4] || (_cache[4] = [
  //               _createTextVNode("Submit")
  //             ])),
  //             _: 1 /* STABLE */
  //           })
  //         ]),
  //         _: 1 /* STABLE */
  //       })
  //     ]),
  //     _: 1 /* STABLE */
  //   }, 8 /* PROPS */, ["model"]))
  // }
  // }
  //
  // })
  // __sfc__.__file = "6df75e582af00b5dc82508cb571ced8e.vue"
  // return __sfc__})()`;
  //
  //   const handleChangeCount = () => {
  //     setShowVue(!showVue);
  //   };
  return (
    <>
      {/* <div>
        {count}
        <button onClick={handleChangeCount}>change count</button>
      </div> */}
      {/* {showVue ? <RenderVue componentCode={componentCode} /> : '不展示'} */}
      {/* <ClosureComp /> */}
      {/* <TestMobxStateTree /> */}
      <LowcodeEditor />
      {/* <InputAmount /> */}

      {/* <WorkFlow /> */}
      {/* <MobxStateTreeDemo store={rootStore} /> */}
    </>
  );
}

export default App;

// System.register(['App'], function (_export) {
//   return {
//     setters: [],
//     execute: function () {
//       // ...
//       console.log('app');
//       return _export('App', function App() {
//         return <div> hkjkj</div>;
//       });
//     },
//   };
// });
