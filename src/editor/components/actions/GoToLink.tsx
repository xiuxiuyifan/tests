import { Input } from 'antd';
import { ComponentEvent } from '../../stores/component-config';
import { useComponent } from '../../stores/components';
import { useState } from 'react';

export interface GoToLinkConfig {
  type: 'goToLink';
  url: string;
}

export interface GoToLinkProps {
  defaultValue?: string;
  onChange?: (config: GoToLinkConfig) => void;
}
export default function GoToLink(props: GoToLinkProps) {
  const { curComponent, curComponentId, updateComponentProps } = useComponent();
  const { defaultValue, onChange } = props;

  const [value, setValue] = useState(defaultValue);

  function urlChange(value: string) {
    if (!curComponentId) return;
    if (!curComponent) return;
    setValue(value);
    onChange?.({
      type: 'goToLink',
      url: value,
    });
    // updateComponentProps(curComponentId, {
    //   [eventName]: {
    //     ...curComponent.props[eventName], // 结构出原有的事件
    //     url: value,
    //   },
    // });
  }

  if (!curComponent) return;

  return (
    <div className="mt-[10px]">
      <div className="flex items-center gap-[10px]">
        <div>链接</div>
        <div>
          <Input onChange={(e) => urlChange(e.target.value)} value={value} />
        </div>
      </div>
    </div>
  );
}
