import { useResource } from "../modules/resource";

export const SampleResource = () => {
  useResource([{ key: "a" }, { key: "b" }]);

  return <div></div>;
};
