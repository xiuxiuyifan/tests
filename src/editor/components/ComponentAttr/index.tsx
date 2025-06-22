// 展示组件的属性

import { Form, Input, Select } from 'antd';
import {
  ComponentConfig,
  ComponentSetter,
  useComponentConfigStore,
} from '../../stores/component-config';
import { useComponent } from '../../stores/components';
import { useEffect } from 'react';

export function ComponentAttr() {
  const { curComponentId, curComponent, updateComponentProps } = useComponent();
  const { componentConfig } = useComponentConfigStore();

  const [form] = Form.useForm();

  const valueChange = (changeValues: ComponentConfig) => {
    if (curComponentId) {
      updateComponentProps(curComponentId, changeValues);
    }
  };

  function renderFormElement(setting: ComponentSetter) {
    const { type, options } = setting;
    if (type === 'select') {
      return <Select options={options} />;
    } else if (type === 'input') {
      return <Input />;
    }
  }

  // 当组件变化之后重新设置 表单数据
  useEffect(() => {
    const data = form.getFieldsValue();
    form.setFieldsValue({ ...data, ...curComponent, ...curComponent?.props });
  }, [curComponent]);
  // 必须要点击选中之后才能显示属性
  if (!curComponent || !curComponentId) return null;
  return (
    <Form form={form} onValuesChange={valueChange} labelCol={{ span: 8 }} wrapperCol={{ span: 14 }}>
      <Form.Item label="组件id">
        <Input value={curComponent?.id} />
      </Form.Item>
      <Form.Item label="组件名称">
        <Input value={curComponent?.name} />
      </Form.Item>
      <Form.Item label="组件描述">
        <Input value={curComponent?.desc} />
      </Form.Item>
      {/* 再遍历样式属性 */}
      {componentConfig[curComponent?.name].setter?.map((setter) => (
        <Form.Item key={setter.name} name={setter.name} label={setter.label}>
          {renderFormElement(setter)}
        </Form.Item>
      ))}
    </Form>
  );
}
