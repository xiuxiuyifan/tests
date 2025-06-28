import { message } from 'antd';
import { PropsWithChildren } from 'react';
import { useDrop } from 'react-dnd';
import { useComponentConfigStore } from '../../stores/component-config';
import { useComponent } from '../../stores/components';
import { useMaterialDrop } from '../../hooks/useMaterialDrop';
import { CommonComponentProps } from '../../interface';

function PageProd({ id, name, children, styles }: CommonComponentProps) {
  return (
    <>
      <div className="p-[20px]" style={{ ...styles }}>
        {children}
      </div>
    </>
  );
}

export default PageProd;
