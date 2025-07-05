import { Input, Select } from 'antd';
import { useComponent } from '../../stores/components';
import { ComponentEvent } from '../../stores/component-config';
import { useEffect, useState } from 'react';

export interface ShowMessageConfig {
  type: 'showMessage';
  config: {
    type: 'success' | 'error';
    text: string;
  };
}

export interface ShowMessageProps {
  value?: ShowMessageConfig['config'];
  onChange: (config: ShowMessageConfig) => void;
}
export default function ShowMessage(props: ShowMessageProps) {
  const { curComponent, curComponentId, updateComponentProps } = useComponent();
  const { value: val, onChange } = props;
  const [type, setType] = useState<'success' | 'error'>(val?.type || 'success');
  const [text, setText] = useState(val?.text || '');

  // 跟新 event props 事件里面的  config
  function messageTextChange(value: string) {
    if (!curComponent) return;
    if (!curComponentId) return;

    setText(value);
    onChange?.({
      type: 'showMessage',
      config: {
        type,
        text: value,
      },
    });
  }

  function messageTypeChange(value: 'success' | 'error') {
    if (!curComponentId) return;

    setType(value);
    onChange?.({
      type: 'showMessage',
      config: {
        text,
        type: value,
      },
    });
  }

  useEffect(() => {
    if (val) {
      setText(val.text);
      setType(val.type);
    }
  }, [val]);

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
              messageTypeChange(value);
            }}
            value={type}
          />
        </div>
      </div>
      <div className="flex items-center gap-[10px] mt-[10px]">
        <div>文本：</div>
        <div>
          <Input
            onChange={(e) => {
              messageTextChange(e.target.value);
            }}
            value={text}
          />
        </div>
      </div>
    </div>
  );
}
