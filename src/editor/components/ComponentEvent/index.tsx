import { Collapse, CollapseProps, Input, Select } from 'antd';
import { useComponent } from '../../stores/components';
import { useComponentConfigStore } from '../../stores/component-config';
import GoToLink from '../actions/GoToLink';
import ShowMessage from '../actions/ShowMessage';

export function ComponentEvent() {
  const { components, curComponent, curComponentId, updateComponentProps } = useComponent();
  const { componentConfig } = useComponentConfigStore();

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

  const items: CollapseProps['items'] = (componentConfig[curComponent?.name].events || []).map(
    (event) => {
      return {
        key: event.name,
        label: event.label,
        children: (
          <div>
            <div className="flex items-center">
              <div>动作：</div>
              {/* 各自的事件，再去对应动作 */}
              <Select
                className="w-[160px]"
                options={[
                  { label: '显示提示', value: 'showMessage' },
                  { label: '跳转链接', value: 'goToLink' },
                ]}
                onChange={(value) => {
                  selectAction(event.name, value);
                }}
                value={curComponent?.props?.[event.name]?.type}
              />
            </div>
            {/* 如果选择了跳转链接 */}
            {curComponent?.props?.[event.name]?.type === 'goToLink' && <GoToLink event={event} />}
            {curComponent?.props?.[event.name]?.type === 'showMessage' && (
              <ShowMessage event={event} />
            )}
          </div>
        ),
      };
    },
  );
  return (
    <div className="px-[10px]">
      <Collapse className="mb-[10px]" items={items}></Collapse>
    </div>
  );
}
