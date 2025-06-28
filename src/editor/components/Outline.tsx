import { Tree } from 'antd';
import { useComponent } from '../stores/components';

export default function Outline() {
  const { components, setCurComponentId } = useComponent();

  return (
    <Tree
      fieldNames={{ title: 'desc', key: 'id' }}
      treeData={components as any}
      showLine
      defaultExpandAll
      onSelect={([selectedKey]) => {
        setCurComponentId(selectedKey as any);
      }}
    />
  );
}
