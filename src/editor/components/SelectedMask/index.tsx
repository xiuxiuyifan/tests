import { useEffect, useMemo, useState } from 'react';
import { getComponentById, useComponent } from '../../stores/components';
import { createPortal } from 'react-dom';
import { Dropdown, Popconfirm, Space } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

interface SelectedMaskProps {
  portalWrapperClassName: string;
  containerClassName: string;
  componentId: number;
}

export default function SelectedMask({
  portalWrapperClassName,
  containerClassName,
  componentId,
}: SelectedMaskProps) {
  const [position, setPosition] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    labelTop: 0,
    labelLeft: 0,
  });

  const { components, curComponentId, deleteComponent, setCurComponentId } = useComponent();

  useEffect(() => {
    updatePosition();
  }, [componentId]);

  useEffect(() => {
    setTimeout(() => {
      updatePosition();
    }, 200);
  }, [components]);

  function updatePosition() {
    if (!componentId) return;

    // 编辑器容器节点
    const container = document.querySelector(`.${containerClassName}`);
    if (!container) return;
    // 组件 当前点击的 node 节点信息
    const node = document.querySelector(`[data-component-id="${componentId}"]`);
    if (!node) return;

    const { top, left, width, height } = node.getBoundingClientRect();
    const { top: containerTop, left: containerLeft } = container.getBoundingClientRect();

    let labelTop = top - containerTop + container.scrollTop;
    let labelLeft = left - containerLeft + width;

    if (labelTop <= 0) {
      labelTop -= -20;
    }

    setPosition({
      top: top - containerTop + container.scrollTop,
      left: left - containerLeft + container.scrollTop,
      width,
      height,
      labelTop,
      labelLeft,
    });
  }

  const el = useMemo(() => {
    return document.querySelector(`.${portalWrapperClassName}`);
  }, []);

  const curComponent = useMemo(() => {
    return getComponentById(componentId, components);
  }, [componentId]);

  function handleDelete() {
    deleteComponent(curComponentId!);
    setCurComponentId(null);
  }

  // 选中的 元素发生变化的时候，向上查找 父级元素
  const parentComponents = useMemo(() => {
    const parentComponents: any = [];
    let component = curComponent;

    // 如果当前元素有父级
    while (component?.parentId) {
      component = getComponentById(component.parentId, components);
      parentComponents.push(component);
    }
    return parentComponents;
  }, [curComponent]);

  useEffect(() => {
    const resizeHandler = () => {
      updatePosition();
    };
    window.addEventListener('resize', resizeHandler);
    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, []);

  return createPortal(
    <>
      <div
        style={{
          position: 'absolute',
          left: position.left,
          top: position.top,
          backgroundColor: 'rgba(0, 0, 255, 0.1)',
          border: '1px dashed blue',
          pointerEvents: 'none',
          width: position.width,
          height: position.height,
          zIndex: 12,
          borderRadius: 4,
          boxSizing: 'border-box',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: position.labelLeft,
          top: position.labelTop,
          fontSize: '14px',
          zIndex: 13,
          display: !position.width || position.width < 10 ? 'none' : 'inline',
          transform: 'translate(-100%, -100%)',
        }}
      >
        <Space>
          <Dropdown
            menu={{
              items: parentComponents.map((item) => ({
                key: item.id,
                label: item.desc,
              })),
              onClick: ({ key }) => {
                setCurComponentId(+key);
              },
            }}
            disabled={parentComponents.length === 0}
          >
            <div
              style={{
                padding: '0 8px',
                backgroundColor: 'blue',
                borderRadius: 4,
                color: '#fff',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {curComponent?.desc}
            </div>
          </Dropdown>
          {curComponentId !== 1 && (
            <div style={{ padding: '0 8px', backgroundColor: 'blue' }}>
              <Popconfirm
                title="确认删除？"
                okText={'确认'}
                cancelText={'取消'}
                onConfirm={handleDelete}
              >
                <DeleteOutlined style={{ color: '#fff' }} />
              </Popconfirm>
            </div>
          )}
        </Space>
      </div>
    </>,
    el!,
  );
}
