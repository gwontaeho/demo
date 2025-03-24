import { useRef } from "react";

const useTree = () => {
  const _useTree = useRef(
    new (class {
      #schema = {};

      openTree = () => {};
      closeTree = () => {};
    })()
  ).current;

  return {};
};

const Tree = () => {
  return <div></div>;
};

export { Tree, useTree };
