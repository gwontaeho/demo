import { useState } from "react";
import { Tab, useTab } from "../modules/tab";

export const SampleTab = () => {
  const { ref, setActive, setHidden, setDisabled } = useTab({
    defaultSchema: [
      { name: "aaa" },
      { name: "bb", disabled: true },
      { name: "cc" },
    ],
  });

  const [test, setTest] = useState(true);

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
