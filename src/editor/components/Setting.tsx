import { useComponent } from "../stores/components";

export function Setting() {
  const { components } = useComponent()

  return <div className="h">
    <pre>
      {JSON.stringify(components, null, 2)}
    </pre>
  </div>;
}
