import { Button, Collapse, CollapseProps, Input, Select } from 'antd';
import { useComponent } from '../../stores/components';
import {
  ComponentEvent,
  ComponentEvent,
  useComponentConfigStore,
} from '../../stores/component-config';
import GoToLink, { GoToLinkConfig } from '../actions/GoToLink';
import ShowMessage, { ShowMessageConfig } from '../actions/ShowMessage';
import { useState } from 'react';
import ActionModal from '../ActionModal';
import { DeleteOutlined } from '@ant-design/icons';

export function ComponentEvent() {
  const { components, curComponent, curComponentId, updateComponentProps } = useComponent();
  const { componentConfig } = useComponentConfigStore();
  const [actionModalOpen, setActionModalOpen] = useState(false);
  const [curEvent, setCurEvent] = useState<ComponentEvent>();

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
              (item: GoToLinkConfig | ShowMessageConfig, index: number) => {
                return (
                  <div key={index}>
                    {item.type === 'goToLink' ? (
                      <div className="border border-[#aaa] m-[10px] p-[10px] relative">
                        <div className="text-[blue]">跳转链接</div>
                        <div>{item.url}</div>
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

  function handleModalOk(config?: GoToLinkConfig | ShowMessageConfig) {
    if (!config || !curEvent || !curComponent) return;

    // 在这里统一更新 props 属性
    updateComponentProps(curComponent?.id, {
      [curEvent.name]: {
        actions: [...(curComponent?.props[curEvent.name]?.actions || []), config],
      },
    });
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
      />
    </div>
  );
}
