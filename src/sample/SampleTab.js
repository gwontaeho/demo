import { Tab, useTab } from "../modules/tab";

export const SampleTab = () => {
  const { schema, setActive, setSchema, setVisible, setDisabled } = useTab({
    defaultSchema: [
      { name: "aaa" },
      { name: "bb", disabled: true },
      { name: "cc" },
    ],
  });

  return (
    <div className="flex flex-col gap-10">
      <div className="flex gap-2">
        <button onClick={() => setActive(0)}>set index 0</button>
        <button onClick={() => setActive(1)}>set index 1</button>
        <button onClick={() => setActive(2)}>set index 2</button>
        <button onClick={() => setVisible(0, true)}>set visible 0 true</button>
        <button onClick={() => setVisible(0, false)}>
          set visible 0 false
        </button>
        <button onClick={() => setDisabled(1, true)}>
          set disabled 1 true
        </button>
        <button onClick={() => setDisabled(1, false)}>
          set disabled 1 false
        </button>
        <button
          onClick={() =>
            setSchema([{ name: "aaa" }, { name: "bb", active: true }])
          }
        >
          set schema
        </button>
      </div>
      <Tab {...schema}>
        <Tab.Panel>a</Tab.Panel>
        <Tab.Panel>b</Tab.Panel>
        <Tab.Panel>c</Tab.Panel>
      </Tab>
    </div>
  );
};
