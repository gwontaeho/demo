import "./prism.css";
import Prism from "./prism";
import { useRef, useLayoutEffect } from "react";

const Highlight = (props) => {
  const { children, lang } = props;

  const _codeRef = useRef(null);

  useLayoutEffect(() => {
    Prism.highlightElement(_codeRef.current);
  }, []);

  return (
    <pre>
      <code ref={_codeRef} className={`language-${lang}`}>
        {children}
      </code>
    </pre>
  );
};

export { Highlight };
