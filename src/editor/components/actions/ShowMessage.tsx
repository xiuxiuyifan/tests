import { Input, Select } from 'antd';
import { useComponent } from '../../stores/components';
import { ComponentEvent } from '../../stores/component-config';

export default function ShowMessage(props: { event: ComponentEvent }) {
  const { curComponent, curComponentId, updateComponentProps } = useComponent();
  const { event } = props;

  // 跟新 event props 事件里面的  config
  function messageTextChange(eventName: string, value: string) {
    if (!curComponent) return;
    if (!curComponentId) return;

    updateComponentProps(curComponentId, {
      [eventName]: {
        ...curComponent.props?.[eventName],
        // showMessage 添加的配置属性是 config 属性、
        config: {
          ...curComponent.props?.[eventName]?.config,
          text: value,
        },
      },
    });
  }

  function messageTypeChange(eventName: string, value: string) {
    if (!curComponentId) return;

    updateComponentProps(curComponentId, {
      [eventName]: {
        ...curComponent?.props?.[eventName],
        config: {
          ...curComponent?.props?.[eventName],
          type: value,
        },
      },
    });
  }

  return (
    <div className="mt-[10px]">
      <div className="flex items-center gap-[10px]">
        <div>类型：</div>
        <div>
          <Select
            style={{
              width: 160,
            }}
            options={[
              {
                label: '成功',
                value: 'success',
              },
              {
                label: '失败',
                value: 'error',
              },
            ]}
            onChange={(value) => {
              messageTypeChange(event.name, value);
            }}
            value={curComponent?.props?.[event.name]?.config?.type}
          />
        </div>
      </div>
      <div className="flex items-center gap-[10px] mt-[10px]">
        <div>文本：</div>
        <div>
          <Input
            onChange={(e) => {
              messageTextChange(event.name, e.target.value);
            }}
            value={curComponent?.props?.[event.name]?.config?.text}
          />
        </div>
      </div>
    </div>
  );
}
