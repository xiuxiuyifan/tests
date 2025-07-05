import { Modal, Segmented } from 'antd';
import { ComponentEvent } from '../stores/component-config';
import { useEffect, useState } from 'react';
import GoToLink, { GoToLinkConfig } from './actions/GoToLink';
import ShowMessage, { ShowMessageConfig } from './actions/ShowMessage';
import CustomJs, { CustomJSConfig } from './actions/CustomJS';

export type ActionConfig = GoToLinkConfig | ShowMessageConfig | CustomJSConfig;

interface ActionModalProps {
  visible: boolean;
  eventConfig: ComponentEvent;
  handleOk: (config?: ActionConfig) => void; // 点击确定的时候，把当前配置发射出去、 同时只能设置一种动作、
  handleCancel: () => void;
  action: ActionConfig; // 选中的装填  tab 栏的 状态、
}

// 在组件内部维护自己组件的数据， 读取 props 里面的数据，或者调用方法把内部数据传递出去、
export default function ActionModal(props: ActionModalProps) {
  const { visible, eventConfig, handleOk, handleCancel, action } = props;

  const [key, setKey] = useState<string>('访问链接');
  const [curConfig, setCurConfig] = useState<ActionConfig>();

  const map = {
    goToLink: '访问链接',
    showMessage: '消息提示',
    customJS: '自定义 JS',
  };

  // 监听外部传入 的 action 然后设置当前 key 的选中
  useEffect(() => {
    if (action?.type) {
      setKey(map[action.type]);
    }
  }, [action]);
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
        <GoToLink
          onChange={(config) => {
            setCurConfig(config);
          }}
          value={action?.type === 'goToLink' ? action.url : ''}
        />

        {key === '消息提示' && (
          <ShowMessage
            onChange={(config) => {
              setCurConfig(config);
            }}
            value={action?.type === 'showMessage' ? action.config : undefined}
          />
        )}
        {key === '自定义 JS' && (
          <CustomJs
            onChange={(config) => {
              setCurConfig(config);
            }}
            value={action?.type === 'customJS' ? action.code : undefined}
          />
        )}
      </div>
    </Modal>
  );
}
