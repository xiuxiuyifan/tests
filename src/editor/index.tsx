import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import { Material } from './components/Material';
import { EditArea } from './components/EditArea';
import { Setting } from './components/Setting';

export default function LowcodeEditor() {
  return (
    <div className="h-[100vh] flex flex-col">
      <Allotment>
        <Allotment.Pane preferredSize={240} maxSize={300} minSize={200}>
          <Material />
        </Allotment.Pane>
        <Allotment.Pane>
          <EditArea />
        </Allotment.Pane>
        <Allotment.Pane preferredSize={300} maxSize={500} minSize={300}>
          <Setting />
        </Allotment.Pane>
      </Allotment>
    </div>
  );
}
