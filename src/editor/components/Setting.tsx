import { Segmented } from 'antd';
import { useComponent } from '../stores/components';
import { useState } from 'react';
import { ComponentAttr } from './ComponentAttr';
import { ComponentStyle } from './ComponentStyle';
import { ComponentEvent } from './ComponentEvent';

export function Setting() {
  const { components, curComponentId } = useComponent();
  const [key, setKey] = useState<string>('属性');

  if (!curComponentId) {
    return null;
  }
  return (
    <div>
      <Segmented<string>
        value={key}
        options={['属性', '样式', '事件']}
        onChange={(value) => {
          setKey(value);
        }}
      ></Segmented>
      <div className="pt-[20px]">
        {key === '属性' && <ComponentAttr />}
        {key === '样式' && <ComponentStyle />}
        {key === '事件' && <ComponentEvent />}
      </div>
    </div>
  );
}
