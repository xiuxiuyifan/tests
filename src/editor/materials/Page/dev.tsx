import { message } from 'antd';
import { PropsWithChildren } from 'react';
import { useDrop } from 'react-dnd';
import { useComponentConfigStore } from '../../stores/component-config';
import { useComponent } from '../../stores/components';
import { useMaterialDrop } from '../../hooks/useMaterialDrop';
import { CommonComponentProps } from '../../interface';

function PageDev({ id, name, children, styles }: CommonComponentProps) {
  const { canDrop, drop } = useMaterialDrop(['Button', 'Container'], id);

  return (
    <>
      <div
        data-component-id={id}
        ref={drop}
        className="p-[20px] h-[100%] box-border"
        style={{ ...styles, border: canDrop ? '2px solid blue' : 'none' }}
      >
        {children}
      </div>
    </>
  );
}

export default PageDev;
