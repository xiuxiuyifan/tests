import { Form, Input, InputNumber, Select } from 'antd';
import {
  ComponentConfig,
  ComponentSetter,
  useComponentConfigStore,
} from '../../stores/component-config';
import { useComponent } from '../../stores/components';
import { CSSProperties, useEffect, useState } from 'react';
import CssEditor from '../CssEditor';
import { debounce } from 'lodash-es';
import StyleToObject from 'style-to-object';

export function ComponentStyle() {
  const { curComponentId, curComponent, updateComponentProps, updateComponentStyles } =
    useComponent();
  const { componentConfig } = useComponentConfigStore();

  const [form] = Form.useForm();

  const valueChange = (changeValues: CSSProperties) => {
    console.log(changeValues);
    if (curComponentId) {
      updateComponentStyles(curComponentId, changeValues);
    }
  };

  function renderFormElement(setting: ComponentSetter) {
    const { type, options } = setting;
    if (type === 'select') {
      return <Select options={options} />;
    } else if (type === 'input') {
      return <Input />;
    } else if (type === 'inputNumber') {
      return <InputNumber />;
    }
  }

  // 当组件变化之后重新设置 表单数据
  useEffect(() => {
    // 先清空
    form.resetFields();
    const data = form.getFieldsValue();
    form.setFieldsValue({ ...data, ...curComponent, ...curComponent?.props });
    // 回显 css 编辑框的值

    setCss(toCSSStr(curComponent?.styles!));
  }, [curComponent]);

  function toCSSStr(css: Record<string, any>) {
    let str = `.comp {\n`;
    for (let key in css) {
      let value = css[key];
      if (!value) {
        continue;
      }
      if (['width', 'height'].includes(key) && !value.toString().endsWith('px')) {
        value += 'px';
      }
      str += `\t${key}: ${value};\n`;
    }
    str += `}`;
    return str;
  }

  const [css, setCss] = useState('');

  // 必须要点击选中之后才能显示属性
  if (!curComponent || !curComponentId) return null;
  const handleEditorChange = debounce((value) => {
    setCss(value);
    let css: Record<string, any> = {};

    try {
      const cssStr = value
        .replace(/\/*.*\*\*\//, '') // 去掉注释 /** */
        .replace(/(\.?[^{]+{)/, '') // 去掉.comp{
        .replace('}', ''); // 去掉 }

      // 横杠转小驼峰
      StyleToObject(cssStr, (name, value) => {
        css[name.replace(/-\w/, (item) => item.toUpperCase().replace('-', ''))] = value;
      });
      console.log(css);
      updateComponentStyles(curComponentId, { ...form.getFieldsValue(), ...css }, true);
    } catch (error) {}
    console.log(value);
  }, 50);

  return (
    <>
      <Form
        form={form}
        onValuesChange={valueChange}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 14 }}
      >
        {/* 再遍历样式属性 */}
        {componentConfig[curComponent?.name].stylesSetter?.map((setter) => (
          <Form.Item key={setter.name} name={setter.name} label={setter.label}>
            {renderFormElement(setter)}
          </Form.Item>
        ))}
      </Form>
      <div className="h-[200px] border-[1px] border-[#ccc]">
        <CssEditor value={css} onChange={handleEditorChange} />
      </div>
    </>
  );
}
