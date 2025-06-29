import { Input } from 'antd';
import { ComponentEvent } from '../../stores/component-config';
import { useComponent } from '../../stores/components';

export default function GoToLink(props: { event: ComponentEvent }) {
  const { curComponent, curComponentId, updateComponentProps } = useComponent();
  const { event } = props;
  function urlChange(eventName: string, value: string) {
    if (!curComponentId) return;
    if (!curComponent) return;

    updateComponentProps(curComponentId, {
      [eventName]: {
        ...curComponent.props[eventName], // 结构出原有的事件
        url: value,
      },
    });
  }

  if (!curComponent) return;

  return (
    <div className="mt-[10px]">
      <div className="flex items-center gap-[10px]">
        <div>链接</div>
        <div>
          <Input
            onChange={(e) => urlChange(event.name, e.target.value)}
            value={curComponent.props[event.name]?.url}
          />
        </div>
      </div>
    </div>
  );
}
