import { useState } from "react";
import { Tab, useTab } from "../../module/tab";
import { Doc } from "../doc-template";

const schema = [
  { name: "tab 1" },
  { name: "tab 2", disabled: true },
  { name: "tab 3" },
];

export const SampleTab = () => {
  const { ref, setActive, setHidden, setDisabled } = useTab({
    defaultSchema: schema,
  });

  const [test, setTest] = useState(true);

  return (
    <Doc>
      <Doc.H1>tab</Doc.H1>

      <Doc.H2># useTab()</Doc.H2>

      <Doc.Item>
        <Doc.Desc>schema</Doc.Desc>
        <Doc.Code>{`const schema = [
  { name: "tab 1" },
  { name: "tab 2", disabled: true },
  { name: "tab 3" },
]`}</Doc.Code>
      </Doc.Item>

      <Doc.Item>
        <Doc.Desc>usage</Doc.Desc>
        <Doc.Code>{`const tab = useTab({
  defaultSchema: schema,
})`}</Doc.Code>
      </Doc.Item>

      <Doc.H2>{`# <Tab />`}</Doc.H2>
      <Doc.H3>{`properties`}</Doc.H3>

      <Doc.Item>
        <Doc.Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>ref</td>
              <td></td>
            </tr>
          </tbody>
        </Doc.Table>
      </Doc.Item>

      <Doc.Item>
        <Doc.Desc>usage</Doc.Desc>
        <div className="flex flex-col flex-1">
          <Doc.Code>{`const Sample = () => {
  const { ref, setActive, setHidden, setDisabled } = useTab({
    defaultSchema: schema,
  });

  return (
    <Tab ref={ref}>
      <Tab.Panel>Panel 1</Tab.Panel>
      <Tab.Panel>Panel 2</Tab.Panel>
      <Tab.Panel>Panel 3</Tab.Panel>
    </Tab>
  );
}`}</Doc.Code>
          <Tab ref={ref}>
            <Tab.Panel>Panel 1</Tab.Panel>
            <Tab.Panel>Panel 2</Tab.Panel>
            <Tab.Panel>Panel 3</Tab.Panel>
          </Tab>
        </div>
      </Doc.Item>

      <Doc.H3>{`setActive()`}</Doc.H3>

      <Doc.Item>
        <Doc.Button onClick={() => setActive(2)}>setActive=2</Doc.Button>
        <Doc.Code>setActive(2)</Doc.Code>
      </Doc.Item>

      <Doc.H3>{`setHidden()`}</Doc.H3>

      <Doc.Item>
        <Doc.Button onClick={() => setHidden(0, true)}>
          setHidden=0,true
        </Doc.Button>
        <Doc.Code>setHidden(0, true)</Doc.Code>
      </Doc.Item>

      <Doc.Item>
        <Doc.Button onClick={() => setHidden(0, false)}>
          setHidden=0,false
        </Doc.Button>
        <Doc.Code>setHidden(0, false)</Doc.Code>
      </Doc.Item>

      <Doc.H3>{`setDisabled()`}</Doc.H3>

      <Doc.Item>
        <Doc.Button onClick={() => setDisabled(1, true)}>
          setDisabled=1,true
        </Doc.Button>
        <Doc.Code>setDisabled(1, true)</Doc.Code>
      </Doc.Item>

      <Doc.Item>
        <Doc.Button onClick={() => setDisabled(1, false)}>
          setDisabled=1,false
        </Doc.Button>
        <Doc.Code>setDisabled(1, false)</Doc.Code>
      </Doc.Item>
    </Doc>
  );

  return (
    <div className="flex flex-col gap-10">
      <div className="flex gap-2 [&>button]:border [&>button]:p-1">
        <button onClick={() => setActive(0)}>set index 0</button>
        <button onClick={() => setActive(1)}>set index 1</button>
        <button onClick={() => setActive(2)}>set index 2</button>
        <button onClick={() => setHidden(0, true)}>set visible 0 true</button>
        <button onClick={() => setHidden(0, false)}>set visible 0 false</button>
        <button onClick={() => setDisabled(1, true)}>
          set disabled 1 true
        </button>
        <button onClick={() => setDisabled(1, false)}>
          set disabled 1 false
        </button>

        <button onClick={() => setTest((prev) => !prev)}>toggle</button>
      </div>

      {test && (
        <Tab ref={ref}>
          <Tab.Panel>a</Tab.Panel>
          <Tab.Panel>b</Tab.Panel>
          <Tab.Panel>c</Tab.Panel>
        </Tab>
      )}
    </div>
  );
};
