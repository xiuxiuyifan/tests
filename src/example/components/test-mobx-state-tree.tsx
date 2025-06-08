import { observer } from 'mobx-react-lite';
import { rootStore } from '../../editor/stores/mobx-state-tree';
import { useEffect } from 'react';

const TestMobxStateTree = observer(() => {
  useEffect(() => {}, []);
  return <div>Hello, {rootStore.authors[0].firstName}</div>;
});

export default TestMobxStateTree;
