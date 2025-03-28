import { Tree, useTree } from "../../module/tree";
import { Doc } from "../doc-template";

export const SampleTree = () => {
  const {} = useTree();

  const data = [
    {
      key: "a",
      label: "a",
      children: [
        { key: "a-1", label: "a-1" },
        { key: "a-2", label: "a-2" },
        { key: "a-3", label: "a-3" },
        { key: "a-4", label: "a-4" },
        { key: "a-5", label: "a-5" },
      ],
    },
    { key: "b", label: "b" },
  ];

  return (
    <Doc>
      <Doc.H1>tree</Doc.H1>

      <Doc.H2>useTree()</Doc.H2>

      <Doc.Item>
        <Doc.Desc>usage</Doc.Desc>
        <Doc.Code></Doc.Code>
      </Doc.Item>

      <Doc.H2>{`# <Tree />`}</Doc.H2>

      <Doc.Item>
        <Doc.Desc>usage</Doc.Desc>
        <div className="flex flex-col flex-1">
          <Tree data={data} />
          <Doc.Code>{`<Tree ref={ref} />`}</Doc.Code>
        </div>
      </Doc.Item>
    </Doc>
  );
};
