import { useState, useLayoutEffect } from "react";

const useControl = (props = {}) => {
  const { control, ...rest } = props;
  const [value, setValue] = useState(control?.value);

  useLayoutEffect(() => {
    if (control) {
      if (control.setValue !== setValue) {
        control.setValue = setValue;
      }
      return () => {
        delete control.setValue;
      };
    }
  }, [control]);

  if (!control) return props;
  return { ...rest, value };
};

export { useControl };
