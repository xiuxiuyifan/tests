import { PropsWithChildren } from 'react';
import { CommonComponentProps } from '../../interface';
import { message } from 'antd';
import { useComponentConfigStore } from '../../stores/component-config';
import { useComponent } from '../../stores/components';
import { useDrop } from 'react-dnd';
import { useMaterialDrop } from '../../hooks/useMaterialDrop';

const Container = ({ id, children }: CommonComponentProps) => {

  const { canDrop, drop } = useMaterialDrop(['Button','Container'], id)

  return (
    <div
      data-component-id={id}
      ref={drop}
      className={`border-[1px] ${canDrop ? 'border-[2px] border-[blue]' : 'border-[1px]'} min-h[100px] p-[20px]`}
    >
      {children}
    </div>
  );
};

export default Container;
