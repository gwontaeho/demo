import { Tree, useTree } from "../../module/tree";

export const SampleTree = () => {
  const data = [
    {
      name: "a",
      children: [
        { name: "a" },
        { name: "a" },
        { name: "a" },
        { name: "a" },
        { name: "a" },
      ],
    },
    { name: "a" },
    { name: "a" },
    { name: "a" },
    { name: "a" },
  ];
  return (
    <div>
      <Tree />
    </div>
  );
};
