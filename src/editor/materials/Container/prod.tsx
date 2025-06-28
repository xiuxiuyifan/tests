import { PropsWithChildren } from 'react';
import { CommonComponentProps } from '../../interface';
import { message } from 'antd';
import { useComponentConfigStore } from '../../stores/component-config';
import { useComponent } from '../../stores/components';
import { useDrop } from 'react-dnd';
import { useMaterialDrop } from '../../hooks/useMaterialDrop';

const ContainerProd = ({ id, children, styles }: CommonComponentProps) => {
  // 只展示组件 不用带 拖拽和  border 了
  return (
    <div style={styles} className={`p-[20px]`}>
      {children}
    </div>
  );
};

export default ContainerProd;
