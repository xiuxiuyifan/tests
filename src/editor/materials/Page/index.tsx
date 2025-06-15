import { message } from 'antd';
import { PropsWithChildren } from 'react';
import { useDrop } from 'react-dnd';
import { useComponentConfigStore } from '../../stores/component-config';
import { useComponent } from '../../stores/components';
import { useMaterialDrop } from '../../hooks/useMaterialDrop';

function Page({ id, name, children }: PropsWithChildren) {

  const { canDrop, drop} = useMaterialDrop(['Button','Container'], id)

  return (
    <>
      <div
        ref={drop}
        className="p-[20px] h-[100%] box-border"
        style={{ border: canDrop ? '2px solid blue' : 'none' }}
      >
        {children}
      </div>
    </>
  );
}

export default Page;
