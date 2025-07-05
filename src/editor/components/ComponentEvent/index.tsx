import { Button, Collapse, CollapseProps, Input, Select } from 'antd';
import { useComponent } from '../../stores/components';
import { useComponentConfigStore } from '../../stores/component-config';
import type { ComponentEvent } from '../../stores/component-config';

import GoToLink, { GoToLinkConfig } from '../actions/GoToLink';
import ShowMessage, { ShowMessageConfig } from '../actions/ShowMessage';
import { useState } from 'react';
import ActionModal, { ActionConfig } from '../ActionModal';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

export function ComponentEvent() {
  const { components, curComponent, curComponentId, updateComponentProps } = useComponent();
  const { componentConfig } = useComponentConfigStore();
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [curEvent, setCurEvent] = useState<ComponentEvent>(); // 记录是哪一种事件类型、onclick 还是 doubleClick?
  const [curAction, setCurAction] = useState<ActionConfig>(); // 记录当前的动作 的配置信息、
  const [curActionIndex, setCurActionIndex] = useState<number>();

  function selectAction(eventName: string, value: string) {
    if (!curComponentId) return;
    updateComponentProps(curComponentId, {
      [eventName]: { type: value },
    });

    //会在 props 上面添加一个属性
    //     onClick: {
    //     type: 'gotoLink'
    // }
  }

  if (!curComponent) return;

  function deleteAction(event: ComponentEvent, index: number) {
    if (!curComponent) return;

    // 取出 事件列表
    const actions = curComponent.props[event.name]?.actions;

    actions.splice(index, 1);

    // 更新事件列表
    updateComponentProps(curComponent.id, {
      [event.name]: {
        actions,
      },
    });
  }

  function editAction(config: ActionConfig, index: number) {
    if (!curComponent) {
      return;
    }
    setCurAction(config);
    setCurActionIndex(index);
    setActionModalOpen(true);
  }

  const items: CollapseProps['items'] = (componentConfig[curComponent?.name]?.events || []).map(
    (event) => {
      return {
        key: event.name,
        label: (
          <div className="flex justify-between leading-[30px]">
            {event.label}
            <Button
              type="primary"
              onClick={(e) => {
                e.stopPropagation();
                setCurEvent(event);
                setActionModalOpen(true);
              }}
            >
              添加动作
            </Button>
          </div>
        ),
        children: (
          <div>
            {(curComponent.props[event.name]?.actions || []).map(
              (item: ActionConfig, index: number) => {
                return (
                  <div key={index}>
                    {item.type === 'goToLink' ? (
                      <div className="border border-[#aaa] m-[10px] p-[10px] relative">
                        <div className="text-[blue]">跳转链接</div>
                        <div>{item.url}</div>
                        <div
                          style={{ position: 'absolute', top: 10, right: 30, cursor: 'pointer' }}
                          onClick={() => editAction(item, index)}
                        >
                          <EditOutlined />
                        </div>
                        <div
                          style={{ position: 'absolute', top: 10, right: 10, cursor: 'pointer' }}
                          onClick={() => deleteAction(event, index)}
                        >
                          <DeleteOutlined />
                        </div>
                      </div>
                    ) : null}
                    {item.type === 'showMessage' ? (
                      <div className="border border-[#aaa] m-[10px] p-[10px] relative">
                        <div className="text-[blue]">{item.config.type}</div>
                        <div>{item.config.text}</div>
                        <div
                          style={{ position: 'absolute', top: 10, right: 30, cursor: 'pointer' }}
                          onClick={() => editAction(item, index)}
                        >
                          <EditOutlined />
                        </div>
                        <div
                          style={{ position: 'absolute', top: 10, right: 10, cursor: 'pointer' }}
                          onClick={() => deleteAction(event, index)}
                        >
                          <DeleteOutlined />
                        </div>
                      </div>
                    ) : null}
                    {item.type === 'customJS' ? (
                      <div className="border border-[#aaa] m-[10px] p-[10px] relative">
                        <div className="text-[blue]">自定义 JS</div>
                        <div
                          style={{ position: 'absolute', top: 10, right: 30, cursor: 'pointer' }}
                          onClick={() => editAction(item, index)}
                        >
                          <EditOutlined />
                        </div>
                        <div
                          style={{ position: 'absolute', top: 10, right: 10, cursor: 'pointer' }}
                          onClick={() => deleteAction(event, index)}
                        >
                          <DeleteOutlined />
                        </div>
                      </div>
                    ) : null}
                  </div>
                );
              },
            )}
          </div>
        ),
      };
    },
  );

  function handleModalOk(config?: ActionConfig) {
    if (!config || !curEvent || !curComponent) return;
    if (curAction) {
      console.log('编辑');
      // 根据 index 更新 actions 其中的某一项
      updateComponentProps(curComponent.id, {
        [curEvent.name]: {
          actions: curComponent?.props[curEvent.name]?.actions.map(
            (item: ActionConfig, index: number) => {
              return index === curActionIndex ? config : item; // 如果是点击当前的 index 则更新为最新的 config 值 否则就用原来的值、
            },
          ),
        },
      });
    } else {
      console.log('新增');
      // 在这里统一更新 props 属性
      updateComponentProps(curComponent?.id, {
        [curEvent.name]: {
          actions: [...(curComponent?.props[curEvent.name]?.actions || []), config],
        },
      });
    }

    setCurAction(undefined);
    setActionModalOpen(false);
  }

  return (
    <div className="px-[10px]">
      <Collapse
        className="mb-[10px]"
        items={items}
        defaultActiveKey={componentConfig[curComponent.name].events?.map((item) => item.name)}
      ></Collapse>
      <ActionModal
        visible={actionModalOpen}
        eventConfig={curEvent!}
        handleCancel={() => {
          setActionModalOpen(false);
        }}
        handleOk={handleModalOk}
        action={curAction}
      />
    </div>
  );
}
