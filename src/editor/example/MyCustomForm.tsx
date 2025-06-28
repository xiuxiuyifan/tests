import React from 'react';
import Form from './Form';
import { Input } from './Input';

const MyCustomForm = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('提交的数据:', values);
  };

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 40 }}>
      <h2>自定义 Form 表单</h2>
      <Form form={form} onFinish={onFinish}>
        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: '用户名必填' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="邮箱"
          name="email"
          rules={[{ required: true, type: 'email', message: '请输入正确的邮箱' }]}
        >
          <Input />
        </Form.Item>
        <button type="submit">提交</button>
      </Form>
    </div>
  );
};

export default MyCustomForm;
