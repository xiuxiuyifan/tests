import { Input } from 'antd';
import { ComponentEvent } from '../../stores/component-config';
import { useComponent } from '../../stores/components';
import { useEffect, useState } from 'react';

export interface GoToLinkConfig {
  type: 'goToLink';
  url: string;
}

export interface GoToLinkProps {
  defaultValue?: string;
  value?: string;
  onChange?: (config: GoToLinkConfig) => void;
}
export default function GoToLink(props: GoToLinkProps) {
  const { curComponent, curComponentId, updateComponentProps } = useComponent();
  const { defaultValue, onChange, value: val } = props;

  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    if (val) {
      setValue(val);
    }
  }, [val]);
  function urlChange(value: string) {
    if (!curComponentId) return;
    if (!curComponent) return;
    setValue(value);
    onChange?.({
      type: 'goToLink',
      url: value,
    });
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
