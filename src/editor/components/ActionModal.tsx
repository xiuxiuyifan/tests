import { Modal, Segmented } from 'antd';
import { ComponentEvent } from '../stores/component-config';
import { useState } from 'react';
import GoToLink, { GoToLinkConfig } from './actions/GoToLink';
import ShowMessage, { ShowMessageConfig } from './actions/ShowMessage';

interface ActionModalProps {
  visible: boolean;
  eventConfig: ComponentEvent;
  handleOk: (config?: GoToLinkConfig | ShowMessageConfig) => void; // 点击确定的时候，把当前配置发射出去、 同时只能设置一种动作、
  handleCancel: () => void;
}

// 在组件内部维护自己组件的数据， 读取 props 里面的数据，或者调用方法把内部数据传递出去、
export default function ActionModal(props: ActionModalProps) {
  const { visible, eventConfig, handleOk, handleCancel } = props;

  const [key, setKey] = useState<string>('访问链接');
  const [curConfig, setCurConfig] = useState<GoToLinkConfig | ShowMessageConfig>();

  return (
    <Modal
      title="事件动作配置"
      width={800}
      open={visible}
      okText="添加"
      cancelText="取消"
      onOk={() => handleOk(curConfig)}
      onCancel={handleCancel}
    >
      <div className="h-[500px]">
        <Segmented
          value={key}
          onChange={setKey}
          block
          options={['访问链接', '消息提示', '自定义 JS']}
        />
        {key === '访问链接' && (
          <GoToLink
            onChange={(config) => {
              setCurConfig(config);
            }}
          />
        )}
        {key === '消息提示' && (
          <ShowMessage
            onChange={(config) => {
              setCurConfig(config);
            }}
          />
        )}
      </div>
    </Modal>
  );
}
